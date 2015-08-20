function WindowShowModalDialog(Url, Opener, Settings) {
	//console.log('using my WindowShowModalDialog!');
	//console.log("Url: " + Url);
	Url = CleanCmsUrl(Url, 'scripts/update_case.asp'); //assume building from script in scripts folder
	//console.log("Clean Url: " + Url);
	
	return window.showModalDialog(Url, Opener, Settings);
}

function WindowOpen(Url, Opener, Settings) {
	//console.log('using my WindowOpen!');
	//console.log("Url: " + Url);
	Url = CleanCmsUrl(Url, 'scripts/update_case.asp'); //assume building from script in scripts folder
	//console.log("Clean Url: " + Url);
	
	win = window.open(Url, Opener, Settings);
}

function WindowOpenSimple(Url, Opener, Width, Height) {
	WindowOpen(Url, Opener, "resizable=1,status=no,toolbar=no,location=no,menu=no,screenX=0,screenY=0,width=" + Width + ",height="+ Height);
}

function SubmitFormWithAjax(FormId, DestDivId){
	var $DestDiv = $('#' + DestDivId);
  if (!$DestDiv[0]) { //this should never be true
      alert('Destination container (#' + DestDivId + ') to load the content (' + File + ') was not found.');
      return;
  }
  
  var $f = $('#'+FormId);
	console.log($f.attr("action"));
	
	
	
	$.ajax(
  {
		url : $f.attr("action"),
    type: $f.attr('method'),
    data : $f.serializeArray(),
    beforeSend: function( xhr ) {
			//xhr.overrideMimeType( "text/plain; charset=x-user-defined" );
			$DestDiv.html($('#CmsLoading').html());
		},
    success:function(data, textStatus, jqXHR) 
    {
      SetHtml(DestDivId, CleanData(data, $f.attr("action")));
      $('#' + DestDivId + 'DataFrom').val($f.attr("action")); //keep a record of what script was last loaded into a div
    },
    error: function(jqXHR, textStatus, errorThrown) 
    {
        //if fails      
    }
  });
}

function GetFileDirectory(File) {
    var Dir = '';
    var SlashIndexOf = File.indexOf('/');

    if (SlashIndexOf == -1) {
        return '';
    }
    else {
        //assume File is at most one directory deep
        return File.substr(0, SlashIndexOf + 1);
    }
}

function LoadCmsPageIntoDiv(File, DestDivId) {
		var $DestDiv = $('#' + DestDivId);
    if (!$DestDiv[0]) { //this should never be true outside of dev/qa
        alert('Destination container (#' + DestDivId + ') to load the content (' + File + ') was not found.');
        return;
    }
    
    $DestDiv.html($('#CmsLoading').html());
    
    $.ajax({
        type: "GET",
        url: GetCmsUrl() + File,
        contentType: "application/x-www-form-urlencoded;charset=UTF-8",
        success: function (data) {
            SetHtml(DestDivId, CleanData(data, File));
            $('#' + DestDivId + 'DataFrom').val(File); //keep a record of what script was last loaded into a div
        }
    });
}

function SetHtml(DestDivId, html) {
    $('#' + DestDivId).html(html);

    if (DestDivId == 'CmsLeftSide' && typeof (CmsLeftSideOnLoad) === "function") {
        CmsLeftSideOnLoad();
    }
    else if (DestDivId == 'CmsRightSide' && typeof (CmsRightSideOnLoad) === "function") {
        CmsRightSideOnLoad();
    }
}

function CleanData(data, DataFrom) {
    var debug = true;
    var DebuggingDataFrom = 'CmsSearch';

    var $TmpDiv = $('<div>');

    var tmp = data;

    data = data.replace(/\uFFFD/g, "");

    $TmpDiv.html(data);

    console.log('loaded ' + DataFrom);
    
    //set any blank/empty form actions to the path of the script being loaded
    $TmpDiv.find('form').each(function(){
    	var $tag = $(this);
    	
    	var action = $tag.attr('action');
    	
    	if (!action || action == '') {
    		$tag.attr('action', DataFrom);
    	}
    });
    
    //fix the page jumping on onclicks
    $TmpDiv.find('[onclick]').each(function(){
    	var $tag = $(this);
    	
    	var OnClick = $tag.attr('onclick');
      if (OnClick == 'self.scrollTo(0, 0);') {
  			$tag.removeAttr('onclick');
  		}
    });

    var href, src, action, value, attr_name;
    $TmpDiv.find('a, script, img, iframe, input, form').each(function () {
        var $tag = $(this);

        //console.log(this);

        href = $tag.attr('href');
        src = $tag.attr('src');
        action = $tag.attr('action');

        if (href) {
            value = href;
            attr_name = 'href';
        }
        else if (src) {
            value = src;
            attr_name = 'src';
        }
        else if (action) {
            value = action;
            attr_name = 'action';
        }
        else {
            value = '';
            if (debug && DataFrom == DebuggingDataFrom) {
                console.log(this);
            }
        }

        if (value != '') {
            if (value == '#') {
                $tag.removeAttr(attr_name);
            }
            else {
                var NewValue = CleanCmsUrl(value, DataFrom);

                $tag.attr(attr_name, NewValue);
            }
        }
    });
    
    //add onclicks to anchors that have a href to a script
    $TmpDiv.find('a').each(function() {
        var $tag = $(this);
        
        var Url = $tag.attr('href');
        
        if (IsScriptUrl(Url)) {
        	Url = Url.replace(GetCmsUrl(),'');
        	
        	$tag.removeAttr('href');
        	$tag.attr('href','javascript:LoadCmsPageIntoDiv("' + Url + '","CmsRightSide");void(0);');          
        }
        else {
        	//console.log('NOT a scripturl: ' + Url);
        }
    });
    
    return $TmpDiv.html();
}

function CleanCmsUrl(Url, CurrentUrl) {
		//no need to change the url when a form it submitting to the same script that it's in
		if (Url == CurrentUrl) { 
			return Url;
		}
	
    if (IsScriptUrl(Url) && Url.indexOf("http://") == -1 && Url.indexOf("https://") == -1) {
        //todo: for other paths, you'll need to consider relative paths

        Url = Url.replace('\\', '/');

        var UrlNew = Url.replace('../', ''); //loading fromd default.asp location, so never go "up"
        if (UrlNew == Url) {
            Url = GetCmsUrl() + GetFileDirectory(CurrentUrl) + UrlNew; //path is to something in the same dir
        }
        else {
            Url = GetCmsUrl() + UrlNew;
        }
    }

    return Url;
}

function IsScriptUrl(Url) {
	if (Url) {
		if (Url.indexOf(".") != -1 || Url.indexOf("/") != -1) {
        if (Url.indexOf("javascript:") == -1) {
        	return true;
        }
  	}
	}
	
  return false;
}