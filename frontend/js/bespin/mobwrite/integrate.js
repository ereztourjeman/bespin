
dojo.provide("bespin.mobwrite.integrate");

// BESPIN

/**
 * Constructor of shared object representing a text field.
 * @param {Node} node A textarea, text or password input
 * @constructor
 */
mobwrite.shareBespinObj = function(node) {
    this._editSession = node;

    var username = this._editSession.username || "[none]";
    var project = this._editSession.project;
    var path = this._editSession.path;
    if (path.indexOf("/") != 0) {
        path = "/" + path;
    }

    var id;
    parts = project.split("+");
    if (parts.length == 1) {
        // This is our project
        id = username + "/" + project + path;
    }
    else {
        // This is someone else's projects
        id = parts[0] + "/" + parts[1] + path;
    }

    // Call our prototype's constructor.
    mobwrite.shareObj.apply(this, [id]);
};

// The textarea shared object's parent is a shareObj.
mobwrite.shareBespinObj.prototype = new mobwrite.shareObj('');

/**
 * Retrieve the user's text.
 * @return {string} Plaintext content.
 */
mobwrite.shareBespinObj.prototype.getClientText = function() {
    return this._editSession.editor.model.getDocument();
};

/**
 * Set the user's text.
 * @param {string} text New text
 */
mobwrite.shareBespinObj.prototype.setClientText = function(text) {
    this._editSession.editor.model.insertDocument(text);
    this._editSession.editor.cursorManager.moveCursor({ row: 0, col: 0 });
    this._editSession.editor.setFocus(true);

    // Nasty hack to allow the editor to know that something has changed.
    // In the first instance the use is restricted to calling the loaded
    // callback
    this._editSession.fireUpdate();
};

/**
 * Modify the user's plaintext by applying a series of patches against it.
 * @param {Array<patch_obj>} patches Array of Patch objects
 */
mobwrite.shareBespinObj.prototype.patchClientText = function(patches) {
  // Set some constants which tweak the matching behaviour.
  // Tweak the relative importance (0.0 = accuracy, 1.0 = proximity)
  this.dmp.Match_Balance = 0.5;
  // At what point is no match declared (0.0 = perfection, 1.0 = very loose)
  this.dmp.Match_Threshold = 0.6;

  var oldClientText = this.getClientText();
  var result = this.dmp.patch_apply(patches, oldClientText);
  // Set the new text only if there is a change to be made.
  if (oldClientText != result[0]) {
    // var cursor = this.captureCursor_();
    this.setClientText(result[0]);
    // if (cursor) {
    //   this.restoreCursor_(cursor);
    // }
  }
  if (mobwrite.debug) {
    for (var x = 0; x < result[1].length; x++) {
      if (result[1][x]) {
        console.info('Patch OK.');
      } else {
        console.warn('Patch failed: ' + patches[x]);
      }
    }
  }
};

/**
 * Handler to accept text fields as elements that can be shared.
 * If the element is a textarea, text or password input, create a new
 * sharing object.
 * @param {*} node Object or ID of object to share
 * @return {Object?} A sharing object or null.
 */
mobwrite.shareBespinObj.shareHandler = function(node) {
    if (node.editor && node.username && node.project && node.path) {
        node.shareHandler = new mobwrite.shareBespinObj(node);
        return node.shareHandler;
    } else {
        return null;
    }
};

// Register this shareHandler with MobWrite.
mobwrite.shareHandlers.push(mobwrite.shareBespinObj.shareHandler);
