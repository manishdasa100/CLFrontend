import { useState } from 'react'

import { Select, SelectItem, Button } from '@nextui-org/react'

import Editor from '@monaco-editor/react'
import vsDarkTrans from '../themes/editorThemes/vsDarkTransparent.json'

import {languageCodes} from '../lib/utils'

export default function CodeEditor({codeSnippets, toggleFullScreenEditor}) {

    const [language, setLanguage] = useState("java");

    const [userCode, setUserCode] = useState("my code")

    console.log("language", language)

    const handleLanguageChange = (e) => {
        const language = e.target.value
        setLanguage(language)
        const langCode = languageCodes[language]
        console.log("Lang code",langCode)
        setUserCode(codeSnippets[langCode])
    }

    const editorOptions = {
        acceptSuggestionOnCommitCharacter: false,
        acceptSuggestionOnEnter: "off",
        quickSuggestions: false,
        autoIndent: true,
        scrollBeyondLastLine: false,
        wordWrap:"on",
        contextmenu: false,
        codeLens: false,
        autoDetectHighContrast: false,
        automaticLayout: true,
        minimap:{enabled: false},
        renderLineHighlightOnlyWhenFocus: true,
        fontSize: 13,
        detectIndentation: true
    }

    const handleEditorDidMount = (monaco) => {
        monaco.editor.defineTheme('vsDarkTransparent', {
            base: 'vs-dark',
            inherit: true,
            rules:[],
            // colors: {
            //     "editor.background": "#00000000"
            // }
            ...vsDarkTrans
        });
        monaco.editor.setTheme('vsDarkTransparent')
    }

    const handleResetCode = () => {
        setUserCode(codeSnippets[languageCodes[language]])
    }

    return (
        <div className='h-full flex flex-col border-1 border-stroke-gray/50 rounded-large'>
            <div id="code-editor-header" className="px-4 py-2 flex-none flex justify-between items-center border-b-1 border-stroke-gray/50">
                <Select
                    aria-label="language-filter"
                    variant="bordered"
                    disallowEmptySelection
                    size="sm"
                    placeholder="Select Language"
                    defaultSelectedKeys={["java"]}
                    onChange={handleLanguageChange}
                    classNames={{
                        base:"w-auto p-0",
                        mainWrapper:"p-0 border-0 border-stroke-gray/30 rounded-xl text-text-gray font-bold",
                        trigger: [
                            "custom-trigger bg-transparent text-text-gray", 
                            "data-[hover=true]:bg-transparent border-0 p-0",
                        ],
                        value:"lang-value text-text-gray font-medium",
                        popoverContent:"w-32 bg-zinc-950 border-1 border-stroke-gray/30",
                    }}

                    listboxProps={{
                        itemClasses: {
                            base: [
                                "text-text-gray",
                                "transition-opacity",
                                "data-[hover=true]:text-foreground",
                                "data-[selectable=true]:focus:bg-gray-400",
                                "data-[pressed=true]:opacity-70",
                            ],
                        },
                    }}
                >
                    <SelectItem key="java">Java</SelectItem>
                    <SelectItem key="python">Python</SelectItem>
                    <SelectItem key="javascript">Javascript</SelectItem>
                    <SelectItem key="cpp">CPP</SelectItem>
                    <SelectItem key="rust">Rust</SelectItem>
                    <SelectItem key="go">Go</SelectItem>
                    <SelectItem key="c">C</SelectItem>
                </Select>
                <div className="flex gap-2 items-center">
                    <Button 
                        isIconOnly 
                        size="sm" 
                        variant="light" 
                        radius="md" 
                        className="data-[hover=true]:bg-default/20"
                        onClick={handleResetCode}
                    >
                        <svg width="14.9" height="14" viewBox="0 0 17 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M11.9667 5.7502H16.1376L13.4798 3.04993C12.6241 2.18112 11.5583 1.55634 10.3894 1.23839C9.22047 0.920444 7.98974 0.920537 6.82089 1.23866C5.65204 1.55679 4.58628 2.18173 3.73073 3.05067C2.87519 3.91961 2.26001 5.00192 1.94706 6.18879M1.0731 14.4847V10.2498M1.0731 10.2498H5.24403M1.0731 10.2498L3.73006 12.9501C4.58574 13.8189 5.6516 14.4437 6.82049 14.7616C7.98938 15.0796 9.22011 15.0795 10.389 14.7613C11.5578 14.4432 12.6236 13.8183 13.4791 12.9493C14.3347 12.0804 14.9498 10.9981 15.2628 9.81121M16.1376 1.51529V5.7485" stroke="#848484" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </Button>
                    <Button 
                        isIconOnly 
                        size="sm" 
                        variant="light" 
                        radius="md" 
                        className="data-[hover=true]:bg-default/20"
                        onClick={toggleFullScreenEditor}
                    >
                        <svg width="14.9" height="14" viewBox="0 0 17 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M1.5293 1V4.81818M1.5293 1H5.28979M1.5293 1L5.91654 5.45455M1.5293 15V11.1818M1.5293 15H5.28979M1.5293 15L5.91654 10.5455M15.3178 1H11.5573M15.3178 1V4.81818M15.3178 1L10.9305 5.45455M15.3178 15H11.5573M15.3178 15V11.1818M15.3178 15L10.9305 10.5455" stroke="#848484" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </Button>
                </div>
            </div>
            <div className="flex-1 mt-1">
                <Editor
                    language={language}
                    value={userCode}
                    theme="vsDarkTransparent"
                    beforeMount={handleEditorDidMount}
                    options={editorOptions}
                    onChange={(value) => setUserCode(value)}
                />
            </div>
            <div className="text-text-gray px-4 py-2 flex-none flex justify-between items-center border-t-1 border-stroke-gray/50">
                <div>
                    <Button isIconOnly size="sm" variant="bordered" radius="md" className="border-stroke-gray/50">
                        <svg width="18" height="18" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M8.34205 1.94C8.43205 1.398 8.90205 1 9.45205 1H10.545C11.095 1 11.565 1.398 11.655 1.94L11.804 2.834C11.874 3.258 12.188 3.598 12.584 3.764C12.982 3.928 13.439 3.906 13.789 3.656L14.526 3.129C14.7428 2.97405 15.0075 2.90107 15.2731 2.92305C15.5386 2.94502 15.7877 3.06053 15.976 3.249L16.749 4.023C17.139 4.412 17.189 5.025 16.869 5.473L16.342 6.21C16.092 6.56 16.07 7.016 16.235 7.414C16.4 7.811 16.74 8.124 17.165 8.194L18.058 8.344C18.601 8.434 18.998 8.903 18.998 9.453V10.547C18.998 11.097 18.601 11.567 18.058 11.657L17.164 11.806C16.74 11.876 16.4 12.189 16.235 12.586C16.07 12.984 16.092 13.44 16.342 13.79L16.869 14.528C17.189 14.975 17.138 15.588 16.749 15.978L15.975 16.751C15.7868 16.9392 15.5378 17.0546 15.2725 17.0765C15.0072 17.0985 14.7427 17.0257 14.526 16.871L13.788 16.344C13.438 16.094 12.982 16.072 12.585 16.237C12.187 16.402 11.875 16.742 11.804 17.166L11.655 18.06C11.565 18.602 11.095 19 10.545 19H9.45105C8.90105 19 8.43205 18.602 8.34105 18.06L8.19305 17.166C8.12205 16.742 7.80905 16.402 7.41205 16.236C7.01405 16.072 6.55805 16.094 6.20805 16.344L5.47005 16.871C5.02305 17.191 4.41005 17.14 4.02005 16.751L3.24705 15.977C3.05858 15.7887 2.94307 15.5395 2.92109 15.274C2.89912 15.0085 2.9721 14.7438 3.12705 14.527L3.65405 13.79C3.90405 13.44 3.92605 12.984 3.76205 12.586C3.59705 12.189 3.25605 11.876 2.83205 11.806L1.93805 11.656C1.39605 11.566 0.998047 11.096 0.998047 10.547V9.453C0.998047 8.903 1.39605 8.433 1.93805 8.343L2.83205 8.194C3.25605 8.124 3.59705 7.811 3.76205 7.414C3.92705 7.016 3.90505 6.56 3.65405 6.21L3.12805 5.472C2.9731 5.25524 2.90012 4.99053 2.92209 4.72499C2.94407 4.45945 3.05958 4.21034 3.24805 4.022L4.02105 3.249C4.20938 3.06053 4.4585 2.94502 4.72404 2.92305C4.98957 2.90107 5.25429 2.97405 5.47105 3.129L6.20805 3.656C6.55805 3.906 7.01505 3.928 7.41205 3.763C7.80905 3.598 8.12205 3.258 8.19205 2.834L8.34205 1.94Z" stroke="#848484" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M13 10C13 10.7956 12.6839 11.5587 12.1213 12.1213C11.5587 12.6839 10.7956 13 10 13C9.20435 13 8.44129 12.6839 7.87868 12.1213C7.31607 11.5587 7 10.7956 7 10C7 9.20435 7.31607 8.44129 7.87868 7.87868C8.44129 7.31607 9.20435 7 10 7C10.7956 7 11.5587 7.31607 12.1213 7.87868C12.6839 8.44129 13 9.20435 13 10Z" stroke="#848484" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    </Button>
                </div>
                <div className="flex gap-3">
                    <Button size="sm" variant="bordered" radius="md" className="font-semibold uppercase border-stroke-gray/50 text-text-gray">Run test</Button>
                    <Button size="sm" color="primary" radius="md" className="font-semibold uppercase">Submit</Button>
                </div>
            </div>  
        </div>       
    )
} 