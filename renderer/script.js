/********************************************************************

    pragm text renderer replaces html contenteditable
    Copyright (C) 2014  Dustin Robert Hoffner

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU Affero General Public License as
    published by the Free Software Foundation, either version 3 of the
    License, or (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Affero General Public License for more details.

    You should have received a copy of the GNU Affero General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.
    
******************************************************************** */

var pragmTextRenderer_typ = function () { // For WebWorker


    this.render = function (text) {
        console.log("Lenght = " + text.length);
        var startTime = new Date().getTime();
        var join = '<span class="dh"></span>';
        var renderText = []; // Needs to get JoinArray "" 
        var textIndex = [];
        renderText.push(join);
        textIndex.push(0);
        var not = 0;
        var add = 1;
        var j = 0;
        for (var i = 0; i < text.length; i += add) {
            add = 1;
            not++;
            if (not > 100000) {
                console.error("looped to long!");
                break;
            }
            switch (text[i]) {
            case "<":
                for (j = i + 2; text[j] != ">" && j - i < 20; j++) {}
                var tagname = text.substr(i, j - i + 1);
                if (tagname == "") {
                    console.error("invalid html");
                    not += 100000;
                    break;
                }
                renderText.push(tagname);
                add = j - i + 1;
                //console.log("Ren: " + tagname);
                break;
            case "&":
                for (j = i + 3; text[j] != ";" && j - i < 6; j++) {}
                var tagname = text.substr(i, j - i + 1);
                add = j - i + 1;
                renderText.push(tagname);
                renderText.push(join); //<span class="dh"></span>
                textIndex.push(i + add);
                break;
            default:
                renderText.push(text[i]);
                renderText.push(join); //<span class="dh"></span>
                textIndex.push(i + add);
                break;
            }
        };

        var endTime = new Date().getTime();
        //console.log("Render Time New" + (endTime - startTime));
        return {
            "text": renderText.join(""),
            "list": textIndex
        }
    };

};

var pragmTextRenderer = new pragmTextRenderer_typ();

var caretRenderer_typ = function () {

    this.render = function (text) {
        var not = 0;
        for (var i = 0; i < text.length; i++) {

            not++;
            if (not > 100) {
                console.error("looped to long!");
                break;
            }
        };

    };
};

var caretRenderer = new caretRenderer_typ();


var pragmDev_typ = function () {

    this.doc = {
        "top": [],
        "left": [],
        "height": [],
        "text": []
    };
    this.caretPlus = -1;
    this.paddingTop = 40;
    this.paddingLeft = 40;
    this.caretIndex = 0;
    this.lineIndex = 0;

    this.mouseposition = function (event) {
        document.getElementById('mouseposition').innerHTML = "X: " + (event.clientX - 40) + "   Y: " + (event.clientY - 40);
    };

    var that = this;
    this.setCaret = function (event) {
        var search = event.clientY - 40;
        var line = -1;
        for (i in that.doc.lines) {
            if (that.doc.lines[i].top < search && that.doc.lines[i].top + that.doc.lines[i].height > search) {
                line = parseInt(i);
                break;
            }
        }
        if (line >= 0) {
            that.lineIndex = line;
            that.caretIndex = that.roundToArray(that.doc.left, event.clientX - 40, that.doc.lines[line].caretStart, that.doc.lines[line].caretEnd);
            that.setCaretPositionByIndex(that.caretIndex);
        }
    };

    this.setContent = function (text) {
        var startTime = new Date().getTime();
        var elm = document.getElementById('line1');
        elm.innerHTML = "";
        var genArray = [];
        genArray.push(0);
        var not = 0;
        for (var i = 0; i < text.length; i++) {

            not++;
            if (not > 100) {
                console.error("looped to long!");
                break;
            }
            var add = text[i];
            if (add == " ") {
                add = "&nbsp;";
            }
            if (add == "&") {
                add = text.substr(i, 5);
                i += 5;
                console.log("addnow " + add);
            }
            if (add == "<") {
                var len = 0,
                    p2start = 0,
                    p2end = 0;
                for (var j = i; j < text.length; j++) {

                    if (text[j] == ">") {
                        len = j - i;
                        break;
                    }
                }
                for (var j = i + len; j < text.length; j++) {

                    if (text[j] == "<") {
                        console.log("found1 at " + j);
                        p2start = j;
                        break;
                    }
                }
                for (var j = p2start; j < text.length; j++) {

                    if (text[j] == ">") {
                        console.log("found2 at " + j);
                        p2end = j;
                        break;
                    }
                }
                var start = text.substr(i, len);
                var mid = text.substr(i + len + 1, p2start - (i + len + 1));
                var end = text.substr(i + len + 1 + mid.length, p2end - (i + len + 1 + mid.length));
                add = start + ' id="test">' + end;
                elm.innerHTML += add;
                //document.getElementById('line1').appendChild(document.createTextNode(add));
                var elm2 = document.getElementById('test');
                for (var k = 0; k < mid.length; k++) {

                    var plus = mid[k];
                    if (plus == " ") {
                        plus = "&nbsp;";
                    }
                    if (plus == "&") {
                        plus = text.substr(k, 5);
                        k += 5;
                        console.log("addnow " + plus);
                    }
                    elm2.innerHTML += plus;
                    genArray.push(elm.offsetWidth);
                }
                console.log("Start: " + start);
                console.log("Mid:   " + mid);
                console.log("End:   " + end);
                console.log("i:     " + i);
                console.log("Start: " + start.length);
                console.log("Mid:   " + mid.length);
                console.log("End:   " + end.length);
                i = p2end;
                console.log("new i " + i);
                add = "";
            }
            elm.innerHTML += add;
            if (i > 0 && genArray[genArray.length - 1] == elm.offsetWidth) {
                //genArray.push(elm.offsetWidth + 4);
                console.log("insert space");
            } else {
                genArray.push(elm.offsetWidth);
            }
        }
        var endTime = new Date().getTime();
        document.getElementById('rendertime').innerHTML = (endTime - startTime);
        this.array = genArray;
    };
    this.charCache = {};
    this.ap = "y";
    this.getCharSize = function (char, cl, charBefore, charAfter) {
        //this.charCache = null;
        //this.charCache = {};
        if (char == " ") {
            char = "&nbsp;";
        }
        cl = cl || "none";
        if (this.charCache[char] && this.charCache[char][cl]) {
            return this.charCache[char][cl];
        } else {
            var elm = document.getElementById('detectbox');
            elm.className = cl;
            elm.innerHTML = charBefore + "" + charAfter + this.ap;
            var first = elm.offsetWidth;
            elm.innerHTML = charBefore + "" + char + "" + charAfter + this.ap;
            var width = elm.offsetWidth - first;
            var height = elm.offsetHeight;
            if (!this.charCache[char]) {
                this.charCache[char] = {};
            }
            if (!this.charCache[char][cl]) {
                this.charCache[char][cl] = {};
            }
            this.charCache[char][cl].w = width;
            this.charCache[char][cl].h = height;
            return this.charCache[char][cl];
        }
    };

    this.setContentNew = function (text) {
        var startTime = new Date().getTime();
        var elm = document.getElementById('line1');
        var genArray = [];
        genArray.push(0);
        var not = 0;
        var width = 0;
        var last = 0;
        var add = "";
        var plus = 1;
        var cl = "none";
        var classList = [];
        var cmd = false;
        for (var i = 0; i < text.length; i += plus) {
            plus = 1;
            cmd = false;
            not++;
            if (not > 200) {
                console.error("looped to long!");
                break;
            }
            add = text[i];
            switch (add) {
            case " ":
                add = "&nbsp;";
                break;
            case "&":
                var pos = 0;
                for (var j = i; j < text.length; j++) {

                    if (text[j] == ";") {
                        pos = j;
                        break;
                    }
                }
                if (pos - i > 0) {
                    add = text.substr(i, pos - i);
                    plus = pos - i + 1;
                }
                break;
            case "<":
                cmd = true;
                if (text[i + 1] == "/") {
                    classList.pop();
                    plus = 7;
                } else {
                    for (var j = i; j < text.length - 4 && text[j] != ">"; j++) {

                        if (text.substr(j, 4) == "dhr-") {
                            classList.push(text.substr(j, 5));
                            break;
                        }
                    }
                    plus = 20;
                }
                break;
            }
            if (!cmd) {
                if (classList.length > 0) {
                    cl = classList.join(' ');
                } else {
                    cl = "none";
                }
                var before = "",
                    after = "";
                if (text[i - 1]) {
                    before = text[i - 1];
                }
                if (text[i + 1]) {
                    after = text[i + 1];
                }

                size = this.getCharSize(add, cl, before, after);
                //console.log(size.h);
                if (size.h > this.caretHeight) {
                    this.caretHeight = size.h;
                }
                last += size.w;
                genArray.push(last);
            }
        }
        elm.innerHTML = text;
        var endTime = new Date().getTime();
        document.getElementById('rendertime').innerHTML = (endTime - startTime);
        this.array = genArray;
    };

    this.setContentNewer = function (text) {
        var startTime = new Date().getTime();
        var elm = document.getElementById('line1');
        var re1 = new Date().getTime(); // 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 
        var doc = {
            "top": [],
            "left": [],
            "height": [],
            "lines": [],
            "index": [],
            "text": []
        };
        //var genArray = [];
        //genArray.push(0);
        var temp = pragmTextRenderer.render(text);
        var re2 = new Date().getTime(); // 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 
        var genText = temp.text;
        var t, s;
        /*for (i in text) {
            genText += text[i] + '<span name="ph"></span>';
        }*/
        elm.innerHTML = genText;
        var re3 = new Date().getTime(); // 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3

        var list = document.getElementsByClassName('dh');
        var re4 = new Date().getTime(); // 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4
        doc.text = temp.list;
        //doc.left.push(0);
        //doc.top.push(0);
        //doc.height.push(0);
        var offsetLeft, offsetTop, offsetHeight, line = -1;
        for (i in list) {
            if (typeof list[i] === "object") {
                offsetLeft = list[i].offsetLeft;
                offsetTop = list[i].offsetTop;
                offsetHeight = list[i].offsetHeight;
                if (typeof offsetTop === "number" && typeof offsetLeft === "number" && typeof offsetHeight === "number") {
                    if (offsetHeight > 0) {
                        doc.left.push(offsetLeft);
                        doc.top.push(offsetTop);
                        doc.height.push(offsetHeight);
                        doc.index.push(line);
                        doc.lines[line].caretEnd = doc.left.length - 1;
                        if (offsetHeight > doc.lines[line].height) {
                            doc.lines[line].height = offsetHeight;
                        }
                        if (offsetTop < doc.lines[line].top) {
                            doc.lines[line].top = offsetTop;
                        }
                    } else {
                        line++;
                        doc.lines[line] = {
                            "caretStart": doc.left.length,
                            "caretEnd": 0,
                            "top": 9999999999999,
                            "height": 0
                        }
                        /*list[i].style.position = "absolute";
                        list[i].style.width = "1px";
                        list[i].style.height = "3px";
                        list[i].style.background = "#000 !important";*/
                        list[i].innerHTML = "&zwj;"; // &zwnj; &zwj; CHROME+SAFARI Needs ("&zwj;" or "&zwnj;") IE11(&zwj; or "" or "&zwnj;") Firefox not good
                        offsetLeft = list[i].offsetLeft;
                        offsetTop = list[i].offsetTop;
                        offsetHeight = list[i].offsetHeight;
                        // This may bugs later (now)
                        // Here is an auto line break
                        doc.left.push(offsetLeft);
                        doc.top.push(offsetTop);
                        doc.height.push(offsetHeight);
                        doc.index.push(line);
                        doc.lines[line].caretEnd = doc.left.length - 1;
                        if (offsetHeight > doc.lines[line].height) {
                            doc.lines[line].height = offsetHeight;
                        }
                        if (offsetTop < doc.lines[line].top) {
                            doc.lines[line].top = offsetTop;
                        }
                        //doc.height.push(doc.height[doc.height.length - 1]);
                    }
                }
            }
        }
        if (doc.height.length > 0) {
            doc.height[0] = doc.height[1];
        }
        var endTime = new Date().getTime();
        document.getElementById('rendertime').innerHTML = (endTime - startTime);
        document.getElementById('re1').innerHTML = (re1 - startTime);
        document.getElementById('re2').innerHTML = (re2 - re1);
        document.getElementById('re3').innerHTML = (re3 - re2);
        document.getElementById('re4').innerHTML = (re4 - re3);
        document.getElementById('re5').innerHTML = (endTime - re4);
        this.doc = null;
        this.doc = doc;
        doc = null;
    };

    this.roundToArray = function (array, value, start, end) {
        console.log("StartArray Start:" + start + " End:" + end + " Value:" + value);
        for (var i = start; i <= end; i++) {
            var i = parseInt(i);
            if (array[i] == value) {
                return i;
            }
            if (i < array.length && array[i] < value && value <= array[i + 1]) {
                if (array[i + 1] - value < value - array[i]) {
                    return (i + 1);
                } else {
                    return i;
                }
            }
        }
        if (value >= end) {
            return end;
        } else {
            return start;
        }
    };

    this.moveCaretLine = function (move) {
        var newLineIndex = this.lineIndex + move;
        if (newLineIndex >= 0 && newLineIndex < this.doc.lines.length) {
            this.lineIndex = newLineIndex;
            this.caretIndex = this.roundToArray(this.doc.left, this.doc.left[this.caretIndex], this.doc.lines[newLineIndex].caretStart, this.doc.lines[newLineIndex].caretEnd);
            console.log("SET TO LINE:" + this.lineIndex + " CARET:" + this.caretIndex);
            this.setCaretPositionByIndex(this.caretIndex);
        } else {
            console.error("Cannot Move Caret Line To New Index " + newLineIndex);
        }
    };

    this.moveCaret = function (move) {
        if (typeof this.doc.left[this.caretIndex + move] === "number") {
            this.setCaretPositionByIndex(this.caretIndex + move);
        } else {
            console.error("Cannot Move Caret");
        }
    };

    this.setCaretPositionByIndex = function (index) {
        if (this.doc.left.length > index && index >= 0) {
            console.log("Set Caret to " + index);
            this.setCaretPosition(this.doc.left[index], this.doc.top[index], this.doc.height[index], index);
        } else {
            console.error("Caret index does not exists!");
        }
    };

    this.setCaretPosition = function (left, top, height, index) {
        var c = document.getElementById('caret');
        c.style.left = left + that.paddingLeft + that.caretPlus + "px";
        c.style.top = top + that.paddingTop + "px";
        c.style.height = height + "px";
        this.caretIndex = index;
        this.lineIndex = this.doc.index[index];
    };
    this.startTime = 0;
    this.counter = 0;
    this.average = 0;
    this.keydown = function (event) {
        //console.log(event.keyCode);
        switch (event.keyCode) {
        case 37:
            that.moveCaret(-1);
            return false;
            break;
        case 39:
            that.moveCaret(1);
            return false;
            break;
        case 38:
            that.moveCaretLine(-1);
            return false;
            break;
        case 40:
            that.moveCaretLine(1);
            return false;
            break;
        default:
            var char = String.fromCharCode(event.keyCode);
            var c = that.doc.text[that.caretIndex];
            //console.log("LOL " + char);
            pretext = pretext.substr(0, c) + char + pretext.substr(c);
            that.setContentNewer(pretext);
            that.caretIndex++;
            that.setCaretPositionByIndex(that.caretIndex);
            //setTimeout('pragmDev.setCaretPositionByIndex(pragmDev.caretIndex);',100);
            return false;
            break;
        }
        // Typing diagnostic:  MIN: 60MS => 16,66 KEYS/SEC   MAX: 250MS => 4 KEYS/S
    };

    this.caretAnnimate = false;
    this.caretAnnimateInterval;
    this.caretOnOff = false;

    this.toggleCaret = function (bool) {
        var elm = document.getElementById('caret');
        if (bool) {
            elm.style.opacity = 0;
        } else {
            if (this.caretOnOff) {
                elm.style.opacity = 0.17;
                this.caretOnOff = !this.caretOnOff;
            } else {
                elm.style.opacity = 1;
                this.caretOnOff = !this.caretOnOff;
            }
        }
    };

    this.caretAnnimationControl = function (bool) {
        var elm = document.getElementById('caret');
        if (!bool && this.caretAnnimate) {
            this.caretAnnimate = false;
            clearInterval(this.caretAnnimateInterval);
            return true;
        }
        if (bool && !this.caretAnnimate) {
            this.caretAnnimate = false;
            this.caretAnnimateInterval = setInterval(this.toggleCaret, 500);
            return true;
        }
        return false;
    };

    this.renderbox = function () {
        var text = document.getElementById('inserttext').innerHTML;
        text = pretext;
        console.log(text);
        this.setContentNew(text);
    };

    this.renderboxOld = function () {
        var text = document.getElementById('inserttext').innerHTML;
        text = pretext;
        console.log(text);
        this.setContent(text);
    };

    this.renderboxNew = function () {
        //var text = document.getElementById('inserttext').innerHTML;
        text = pretext;
        console.log(text);
        this.setContentNewer(text);
    };

    this.onload = function () {
        that.caretAnnimationControl(true);
        zoominnerWidth = window.innerWidth;
        zoominnerHeight = window.innerHeight;
    };

};

var zoominnerWidth = 0;
var zoominnerHeight = 0;

function onresizeer() {
    iszoom = window.innerWidth / zoominnerWidth != 1 && window.innerHeight / zoominnerHeight != 1;
    zoominnerWidth = window.innerWidth;
    zoominnerHeight = window.innerHeight;
    document.getElementById('onresize').innerHTML = 'true ' + iszoom;
    setTimeout("document.getElementById('onresize').innerHTML = 'false false';", 200);
}


var pragmDev = new pragmDev_typ();
var pretext = 'Das ist ein Test, welcher gut funktionieren sollt, denn die volumnioese expanson bla bla Das ist ein Test, welcher gut funktionieren sollt, denn die volumnioese <span class="dhr-b"><span class="dhr-r">expanson</span></span> bla bla Das ist ein Test, welcher gut funktionieren sollt, denn die volumnioese expanson bla bla';

window.onmousemove = pragmDev.mouseposition;
window.onclick = pragmDev.setCaret;
window.onkeydown = pragmDev.keydown;
window.onload = pragmDev.onload;
window.onresize = onresizeer;