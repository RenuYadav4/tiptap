import React, { useState } from 'react';
import { EditorContent, useEditor } from '@tiptap/react';
import { FaBold, FaItalic, FaUnderline, FaAlignLeft, FaAlignCenter, FaAlignRight, FaListUl, FaListOl, FaPaintBrush, FaPalette } from 'react-icons/fa';
import StarterKit from '@tiptap/starter-kit';
import { TextStyle } from '@tiptap/extension-text-style';
import { Color } from '@tiptap/extension-color';
import { TextAlign } from '@tiptap/extension-text-align';
import { Underline } from '@tiptap/extension-underline';
import '../index.css';

const extensions = [
    StarterKit,
    TextStyle,
    Color,
    TextAlign.configure({ types: ['paragraph'] }),
    Underline,
];

const content = ``;

const Tiptap = () => {
    const editor = useEditor({
        extensions,
        content,
    });

    const [savedContent, setSavedContent] = useState("");
    const [activeButtons, setActiveButtons] = useState({
        bold: false,
        italic: false,
        underline: false,
        highlight: false,
        alignLeft: false,
        alignCenter: false,
        alignRight: false,
        bulletList: false,
        orderedList: false,
    });
    const [isColorPickerVisible, setIsColorPickerVisible] = useState(false);  // State for showing/hiding the color picker

    const handleSave = () => {
        if (editor) {
            setSavedContent(editor.getHTML());
            console.log("Saved Content:", editor.getHTML());
        }
    };

    const handleToggleButton = (button) => {
        setActiveButtons(prevState => ({
            ...prevState,
            [button]: !prevState[button],
        }));
    };

    const handleColorChange = (color) => {
        editor.chain().focus().setColor(color).run();
    };

    const handleHighlight = () => {
        editor.chain().focus().setTextStyle({ backgroundColor: 'yellow' }).run();
        handleToggleButton('highlight');
    };

    const toggleColorPicker = () => {
        setIsColorPickerVisible(prevState => !prevState);  // Toggle the color picker visibility
    };

    if (!editor) {
        return null;
    }

    return (

        <div className="app-container">
            {/* Top Navbar with Heading */}
            <div className="top-navbar">
                <h1>Tiptap Editor</h1>
            </div>

            {/* Bottom Navbar with Editor Tools */}
            <div className="bottom-navbar">
                {/* Text Formatting Buttons */}
                <div className="button-group">
                    <button
                        onClick={() => { editor.chain().focus().toggleBold().run(); handleToggleButton('bold'); }}
                        className={activeButtons.bold ? 'is-active' : ''}
                    >
                        <FaBold />
                    </button>
                    <button
                        onClick={() => { editor.chain().focus().toggleItalic().run(); handleToggleButton('italic'); }}
                        className={activeButtons.italic ? 'is-active' : ''}
                    >
                        <FaItalic />
                    </button>
                    <button
                        onClick={() => { editor.chain().focus().toggleUnderline().run(); handleToggleButton('underline'); }}
                        className={activeButtons.underline ? 'is-active' : ''}
                    >
                        <FaUnderline />
                    </button>
                    <button
                        onClick={handleHighlight}
                        className={activeButtons.highlight ? 'is-active' : ''}
                    >
                        <FaPaintBrush />
                    </button>
                </div>

                {/* Text Alignment Buttons */}
                <div className="button-group">
                    <button
                        onClick={() => { editor.chain().focus().setTextAlign('left').run(); handleToggleButton('alignLeft'); }}
                        className={activeButtons.alignLeft ? 'is-active' : ''}
                    >
                        <FaAlignLeft />
                    </button>
                    <button
                        onClick={() => { editor.chain().focus().setTextAlign('center').run(); handleToggleButton('alignCenter'); }}
                        className={activeButtons.alignCenter ? 'is-active' : ''}
                    >
                        <FaAlignCenter />
                    </button>
                    <button
                        onClick={() => { editor.chain().focus().setTextAlign('right').run(); handleToggleButton('alignRight'); }}
                        className={activeButtons.alignRight ? 'is-active' : ''}
                    >
                        <FaAlignRight />
                    </button>
                </div>

                {/* Font Size Button */}
                <div className="button-group">
                    <select
                        onChange={(e) => editor.chain().focus().setTextStyle({ fontSize: e.target.value }).run()}
                        value={editor.getAttributes('textStyle').fontSize || '16px'}
                    >
                        <option value="16px">16px</option>
                        <option value="18px">18px</option>
                        <option value="20px">20px</option>
                        <option value="24px">24px</option>
                        <option value="30px">30px</option>
                    </select>
                </div>

                {/* Color Picker with Icon Toggle */}
                <div className="color-picker">
                    <button className="color-palette-button" onClick={toggleColorPicker}>
                        <FaPalette /> {/* Color Picker Icon */}
                    </button>

                    {/* Color Picker Input and Palette */}
                    {isColorPickerVisible && (
                        <div className="color-picker-container">
                            {/* Predefined Color Palette */}
                            <div className="color-palette">
                                {["#FF0000", "#00FF00", "#0000FF", "#FFFF00", "#FF00FF", "#00FFFF", "#000000", "#FFFFFF", "#808080"].map(color => (
                                    <button
                                        key={color}
                                        style={{ backgroundColor: color }}
                                        onClick={() => handleColorChange(color)}
                                        className={editor.isActive('textStyle') && editor.getAttributes('textStyle').color === color ? 'is-active' : ''}
                                    />
                                ))}
                            </div>
                            {/* HTML Color Picker */}
                            <input
                                type="color"
                                onChange={(e) => handleColorChange(e.target.value)}
                                value={editor.getAttributes('textStyle').color || '#000000'}
                            />
                        </div>
                    )}
                </div>

                {/* List Buttons */}
                <div className="button-group">
                    <button
                        onClick={() => { editor.chain().focus().toggleBulletList().run(); handleToggleButton('bulletList'); }}
                        className={activeButtons.bulletList ? 'is-active' : ''}
                    >
                        <FaListUl />
                    </button>
                    <button
                        onClick={() => { editor.chain().focus().toggleOrderedList().run(); handleToggleButton('orderedList'); }}
                        className={activeButtons.orderedList ? 'is-active' : ''}
                    >
                        <FaListOl />
                    </button>
                </div>
            </div>

            {/* Editor Content */}
            <div>
                <EditorContent editor={editor} />
            </div>

            {/* Save Button */}
            <button onClick={handleSave} className="save-button">Save</button>

            {/* Display Saved Content */}
            {savedContent && <div><h3>Saved Content:</h3><div dangerouslySetInnerHTML={{ __html: savedContent }} /></div>}
        </div>
    );
}

export default Tiptap;
