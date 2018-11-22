const vscode = require('vscode');

const getAllIndexes = (arr, func) => {
    let indexes = [];
    arr.forEach((line, i) => {
        if (func(line)) indexes.push(i);
    });
    return indexes;
};

const splitString = string => {
    const trimString = string.trim();
    const lineArr = trimString.split("\n").map(line => line.trim());
    const importIndex = getAllIndexes(lineArr, line => line === "import {");
    const fromIndex = getAllIndexes(
        lineArr,
        line =>
            line.match(/} from/) && !line.match(/import {/) && !line.match(/, {/)
    );
    if (importIndex.length > 0 && fromIndex.length > 0) {
        const indexList = importIndex
            .map((importInd, i) => [importInd, fromIndex[i]])
            .map(arr => {
                const indexes = [];
                let i = +arr[0];
                while (i <= +arr[1]) {
                    indexes.push(i);
                    i++;
                }
                return indexes;
            })
            .reduce((prev, curr) => prev.concat(curr));
        const arrays = importIndex
            .map((index, i) => lineArr.slice(index, fromIndex[i] + 1))
            .map(arr => arr.join(""));
        lineArr.forEach((line, i) => {
            if (!indexList.includes(i)) arrays.push(line);
        });
        return arrays;
    } else {
        return lineArr.filter(line => line.length !== 0);
    }
};

const extractPath = string => {
    const matchedText = string.match(/(\"|\')(.+?)(\"|\')/i);
    return matchedText && matchedText[0].trim();
};

const extractName = string => {
    const matchedText = string.match(/import(.*?)from/);
    return matchedText && matchedText[1].trim();
};

const createRequireString = string => {
    const path = extractPath(string);
    const name = extractName(string);

    if (!name && path) return `require(${path});`;

    if (name.match(/\{/i) && name.match(/\}/i) && !path.match(/\.\//i)) {
        const nameSring = string.match(/{(.+?)}/i)[1].trim();
        const extraName =
            string
                .match(/import(.+?){/i)[1]
                .trim()
                .replace(",", "") ||
            string
                .match(/}(.+?)from/i)[1]
                .trim()
                .replace(",", "") ||
            null;
        if (nameSring.includes(",")) {
            const names = nameSring.split(",").map(name => name.trim());
            let returnedString = extraName
                ? `const ${extraName} = require(${path});\n`
                : "";
            names.forEach((name, i) => {
                if (name.includes("as")) {
                    const [originalName, newName] = name
                        .split(" as ")
                        .map(name => name.trim());
                    if (i === names.length - 1) {
                        returnedString = `${returnedString}const ${newName} = require(${path}).${originalName};`;
                    } else {
                        returnedString = `${returnedString}const ${newName} = require(${path}).${originalName};\n`;
                    }
                } else {
                    if (i === names.length - 1) {
                        returnedString = `${returnedString}const ${name} = require(${path}).${name};`;
                    } else {
                        returnedString = `${returnedString}const ${name} = require(${path}).${name};\n`;
                    }
                }
            });
            return returnedString;
        } else {
            if (nameSring.includes("as")) {
                const [originalName, newName] = nameSring
                    .split("as")
                    .map(name => name.trim());
                return extraName
                    ? `const ${extraName} = require(${path});\nconst ${newName} = require(${path}).${originalName};`
                    : `const ${newName} = require(${path}).${originalName};`;
            } else {
                return extraName
                    ? `const ${extraName} = require(${path});\nconst ${nameSring} = require(${path}).${nameSring};`
                    : `const ${nameSring} = require(${path}).${nameSring};`;
            }
        }
    }

    if (name.match(/\{/i) && name.match(/\}/i) && path.match(/\.\//i)) {
        const nameSring = string.match(/{(.+?)}/i)[1].trim();

        if (nameSring.includes(",")) {
            const names = nameSring.split(",").map(name => name.trim());
            let returnedString = "";
            names.forEach((name, i) => {
                if (i === names.length - 1) {
                    returnedString = `${returnedString}const ${name} = require(${path}).${name};`;
                } else {
                    returnedString = `${returnedString}const ${name} = require(${path}).${name};\n`;
                }
            });
            return returnedString;
        } else {
            return `const ${nameSring} = require(${path}).${nameSring};`;
        }
    }

    if (!name.match(/\{/i) && !name.match(/\}/i) && path.match(/\.\//i)) {
        return `const ${name} = require(${path});`;
    }

    return `const ${name} = require(${path});`;
};

const parseString = string => {
    const arrayedString = splitString(string);
    if (arrayedString.length === 1) {
        return createRequireString(arrayedString[0].trim());
    } else {
        const convertedStrings = arrayedString.map(line =>
            createRequireString(line.trim())
        );
        let returnedString = "";
        convertedStrings.forEach((line, i) => {
            if (i === arrayedString.length - 1) {
                returnedString = `${returnedString}${line}`;
            } else {
                returnedString = `${returnedString}${line}\n`;
            }
        });
        return returnedString;
    }
};

const insertText = (val) => {
    const editor = vscode.window.activeTextEditor;

    if (!editor) {
        vscode.window.showErrorMessage('Can\'t insert log because no document is open');
        return;
    }

    const selection = editor.selection;

    const range = new vscode.Range(selection.start, selection.end);
    
    const returnedString = parseString(val);

    editor.edit((editBuilder) => {
        editBuilder.replace(range, returnedString);
    });

}

function activate(context) {

    console.log('Congratulations, your extension "javascript" is now active!');

    const insertLogStatement = vscode.commands.registerCommand('extension.insertLogStatement', () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) { return; }

        const selection = editor.selection;
        const text = editor.document.getText(selection);
        
        insertText(text)
        
    });
    context.subscriptions.push(insertLogStatement);

}
exports.activate = activate;

function deactivate() {
}
exports.deactivate = deactivate;



