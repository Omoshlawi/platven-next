"use client";

import React, { useState } from 'react';
import {
    FacebookShareButton,
    WhatsappShareButton,
    FacebookIcon,
    WhatsappIcon,
} from 'react-share';
import { Clipboard, ClipboardCheck, Share2 } from 'lucide-react';
import { useToast } from './ui/use-toast';

interface SharePropertyProps {
    propertyUrl: string;
    title: string;
}

const ShareProperty: React.FC<SharePropertyProps> = ({ propertyUrl, title }) => {
    const { toast } = useToast();
    const [copied, setCopied] = useState<boolean>(false);
    const [showOptions, setShowOptions] = useState<boolean>(false);

    const copyToClipboard = (): void => {
        navigator.clipboard.writeText(`${title} \n\n ${propertyUrl}`).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
            showToast('Property link copied to clipboard successfully!');
            setShowOptions(false);
        });
    };

    const toggleOptions = (): void => {
        setShowOptions(!showOptions);
    };

    const showToast = (message: string): void => {
        toast({
            variant: "default",
            title: "Success!",
            description: message,
        });
    };

    const handleShare = (platform: string): void => {
        showToast(`Opening ${platform} to share property link!`);
        setShowOptions(false);
    };

    return (
        <div className="relative">
            {/* Main Share Button */}
            <button
                onClick={toggleOptions}
                className="text-white rounded-full p-2 transition duration-200 flex items-center focus:outline-none"
            >
                <Share2 size={24} />
            </button>

            {/* Share Options */}
            {showOptions && (
                <div className="absolute top-full mt-2 flex flex-col items-center space-y-4 bg-white shadow-lg p-4 rounded-lg right-1 z-10">
                    <div className="flex flex-col items-center gap-2">
                        {/* Copy to Clipboard Button */}
                        <button
                            onClick={copyToClipboard}
                            className="bg-blue-600 hover:bg-blue-700 text-white rounded-full p-3 transition duration-200 flex items-center focus:outline-none"
                        >
                            {copied ? <ClipboardCheck size={24} /> : <Clipboard size={24} />}
                        </button>
                        {/* Facebook Share Button */}
                        <FacebookShareButton
                            url={propertyUrl}
                            className="focus:outline-none"
                            onClick={() => handleShare('Facebook')}
                        >
                            <div className="flex items-center justify-center bg-blue-600 rounded-full p-3 transition duration-200">
                                <FacebookIcon size={32} round />
                            </div>
                        </FacebookShareButton>
                        {/* WhatsApp Share Button */}
                        <WhatsappShareButton
                            url={propertyUrl}
                            title={title}
                            className="focus:outline-none"
                            onClick={() => handleShare('WhatsApp')}
                        >
                            <div className="flex items-center justify-center bg-green-600 rounded-full p-3 transition duration-200">
                                <WhatsappIcon size={32} round />
                            </div>
                        </WhatsappShareButton>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ShareProperty;
