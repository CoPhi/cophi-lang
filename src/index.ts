/* 
 *  CophiLang: DSL Language base definitions
 *  Copyright (C) 2021 Simone Zenzaro, ILC-CNR
 *  
 *  This library is free software; you can redistribute it and/or
 *  modify it under the terms of the GNU Lesser General Public
 *  License as published by the Free Software Foundation; either
 *  version 2.1 of the License, or any later version.
 *  
 *  This library is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
 *  Lesser General Public License for more details.
 *  
 *  You should have received a copy of the GNU Lesser General Public
 *  License along with this library; if not, write to the Free Software
 *  Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301
 *  USA
 */

export interface Language {
    id: Promise<string> // Language unique identifier e.g. gs-lit
    errors: (code: string) => Promise<Error[]> // given the a code string, returns a list of syntax errors
    suggestions: (code: string, pos: Position) => Promise<Suggestion[]> // given a code string and a position, returns a list of autocompletion suggestions
    highlighter: Promise<IMonarchLanguage> // returns a the Monarch tokenizer rules to be used for syntax highlighting

    name: Promise<string>
    version: Promise<string>
    capabilities: Promise<string[]> // list of capabilities (autocomplete, highlight, ...)  // TODO: maybe it is not needed
}


export interface Error {
    message: string;
    range: Range
}

export interface Position {
    line: number
    column: number
}

export interface Range {
    start: Position;
    end: Position;
}

export interface Suggestion {
    label: string;
    kind: SuggestionKind;
    documentation?: string;
    insertText: string;
    range: Range;
}

export type SuggestionKind = // TODO check which one is irrelevant
    | "Method" | "Function" | "Constructor" | "Field" | "Variable" | "Class" | "Struct"
    | "Interface" | "Module" | "Property" | "Event" | "Operator" | "Unit" | "Value" | "Constant"
    | "Enum" | "EnumMember" | "Keyword" | "Text" | "Color" | "File" | "Reference" | "Customcolor"
    | "Folder" | "TypeParameter" | "User" | "Issue" | "Snippet"


// Monarch
export interface IMonarchLanguage {
    tokenizer: { [name: string]: IMonarchLanguageRule[] };
    ignoreCase?: boolean;
    unicode?: boolean;
    defaultToken?: string;
    brackets?: { open: string, close: string, token: string }[];
    start?: string;
    tokenPostfix?: string;
    includeLF?: boolean;
    [key: string]: any;
}

export type IMonarchLanguageRule =
    | [string | RegExp, IMonarchLanguageAction]
    | [string | RegExp, IMonarchLanguageAction, string]
    | { regex?: string | RegExp, action?: IMonarchLanguageAction, include?: string }
    ;

export type IMonarchLanguageAction = string | IExpandedMonarchLanguageAction | string[] | IExpandedMonarchLanguageAction[];

export interface IExpandedMonarchLanguageAction {
    group?: IMonarchLanguageAction[];
    cases?: Object;
    token?: string;
    next?: string;
    switchTo?: string;
    goBack?: number;
    bracket?: string;
    nextEmbedded?: string;
    log?: string;
}
