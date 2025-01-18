import React from 'react';
import { useEditor } from "novel";
import ImageBlockMenu from '../components/ImageBlock/components/ImageBlockMenu';


// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ImageSelector = ({ container }: { container: React.RefObject<any> }) => {
    const { editor } = useEditor();

    if (!editor) return null;

    return (
        <ImageBlockMenu editor={editor} appendTo={container} />
    );
};

export default ImageSelector;