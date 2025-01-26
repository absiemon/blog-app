
import React, { useState } from "react";

interface ExpandableContentProps {
    content: string; // Ensure content is always a string
    maxLength?: number;
    style?: React.CSSProperties;
}

const ExpandableContent: React.FC<ExpandableContentProps> = ({
    content,
    maxLength = 200,
    style = {},
}) => {
    const [readMoreOpened, setReadMoreOpened] = useState(false);

    const toggleReadMore = () => {
        setReadMoreOpened(!readMoreOpened);
    };

    // Ensure content is a string
    const safeContent = typeof content === "string" ? content : "";

    return (
        <div className="text-md" style={{ display: "inline", ...style }}>
            <span style={{ whiteSpace: "pre-line" }}> {/* Preserve formatting */}
                {readMoreOpened
                    ? safeContent
                    : `${safeContent.substring(0, maxLength)}...`}
            </span>

            {/* Show "Read More" or "Read Less" button if content exceeds maxLength */}
            {safeContent.length > maxLength && (
                <span
                    className="text-blue-500 cursor-pointer ml-1"
                    onClick={toggleReadMore}
                >
                    {readMoreOpened ? "Read Less" : "Read More"}
                </span>
            )}
        </div>
    );
};

export default ExpandableContent;