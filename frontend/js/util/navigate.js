//  ***** BEGIN LICENSE BLOCK *****
// Version: MPL 1.1
// 
// The contents of this file are subject to the Mozilla Public License  
// Version
// 1.1 (the "License"); you may not use this file except in compliance  
// with
// the License. You may obtain a copy of the License at
// http://www.mozilla.org/MPL/
// 
// Software distributed under the License is distributed on an "AS IS"  
// basis,
// WITHOUT WARRANTY OF ANY KIND, either express or implied. See the  
// License
// for the specific language governing rights and limitations under the
// License.
// 
// The Original Code is Bespin.
// 
// The Initial Developer of the Original Code is Mozilla.
// Portions created by the Initial Developer are Copyright (C) 2009
// the Initial Developer. All Rights Reserved.
// 
// Contributor(s):
// 
// ***** END LICENSE BLOCK *****
//

if (typeof Bespin == "undefined") Bespin = {};

Bespin.Navigate = new function() {

    // Private
    var go = function(url) {
        location.href = url;
    }
    
    // Public
    return {
        dashboard: function() {
            go("dashboard.html");
        },
        
        home: function() {
            go("index.html");
        },
        
        quickEdit: function() {
    		go("editor.html#new=true");
    	},
    	
        editor: function(project, path) {
            var url = "editor.html#";
            var args = [];
            
            if (project) args.push("project=" + project);
            if (path) args.push("path=" + path);
            
            if (args.length > 0) url += args.join("&");
            
            go(url);
        }
    };
    
}();