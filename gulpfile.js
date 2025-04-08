const { src, dest, series, watch } = require(`gulp`),
    CSSLinter = require(`gulp-stylelint`),
    del = require(`del`),
    babel = require(`gulp-babel`),
    htmlCompressor = require(`gulp-htmlmin`),
    jsCompressor = require(`gulp-uglify`),
    jsLinter = require(`gulp-eslint`),
    rename = require(`gulp-rename`),
    cleanCSS = require(`gulp-clean-css`),
    browserSync = require(`browser-sync`),
    reload = browserSync.reload;

let browserChoice = `default`;

// Browser options
async function brave () { browserChoice = `brave browser`; }
async function chrome () { browserChoice = `google chrome`; }
async function edge () { browserChoice = `microsoft edge`; }
async function firefox () { browserChoice = `firefox`; }
async function opera () { browserChoice = `opera`; }
async function safari () { browserChoice = `safari`; }
async function vivaldi () { browserChoice = `vivaldi`; }
async function allBrowsers () {
    browserChoice = [
        `brave browser`, `google chrome`, `microsoft edge`,
        `firefox`, `opera`, `safari`, `vivaldi`
    ];
}

// Validate CSS
let lintCSS = () => {
    return src(`styles/main.css`)
        .pipe(CSSLinter({
            failAfterError: false,
            reporters: [{ formatter: `string`, console: true }]
        }));
};

// Validate JS
let lintJS = () => {
    return src(`scripts/main.js`)
        .pipe(jsLinter())
        .pipe(jsLinter.formatEach(`compact`));
};

// Transpile JS for dev
let transpileJSForDev = () => {
    return src(`scripts/main.js`)
        .pipe(babel())
        .pipe(dest(`temp/scripts`));
};

// Copy CSS to temp for dev
let copyCSSToTemp = () => {
    return src(`styles/main.css`)
        .pipe(dest(`temp/styles`));
};

// HTML copy (no validation tool here)
let copyHTMLToTemp = () => {
    return src(`index.html`)
        .pipe(dest(`temp`));
};

// Compress HTML for prod
let compressHTML = () => {
    return src(`index.html`)
        .pipe(htmlCompressor({ collapseWhitespace: true }))
        .pipe(dest(`prod`));
};

// Minify CSS for prod
let minifyCSS = () => {
    return src(`styles/main.css`)
        .pipe(cleanCSS())
        .pipe(rename({ suffix: `.min` }))
        .pipe(dest(`prod/styles`));
};

// Transpile + Minify JS for prod
let transpileJSForProd = () => {
    return src(`scripts/main.js`)
        .pipe(babel())
        .pipe(jsCompressor())
        .pipe(rename({ suffix: `.min` }))
        .pipe(dest(`prod/scripts`));
};

// Copy static (if any other root-level files)
let copyAssetsToProd = () => {
    return src([`*.*`, `!*.html`, `!gulpfile.js`])
        .pipe(dest(`prod`));
};

// Clean
async function clean() {
    let fs = require(`fs`),
        foldersToDelete = [`./temp`, `prod`];

    for (let folder of foldersToDelete) {
        try {
            fs.accessSync(folder, fs.F_OK);
            process.stdout.write(`\n\tDeleting ${folder}...\n`);
            del(folder);
        } catch {
            process.stdout.write(`\n\t${folder} not found.\n`);
        }
    }
}

// Live Server
let serve = () => {
    browserSync({
        notify: true,
        reloadDelay: 50,
        browser: browserChoice,
        server: {
            baseDir: [`temp`]
        }
    });

    watch(`styles/main.css`, series(lintCSS, copyCSSToTemp)).on(`change`, reload);
    watch(`scripts/main.js`, series(lintJS, transpileJSForDev)).on(`change`, reload);
    watch(`index.html`, copyHTMLToTemp).on(`change`, reload);
};

// Default (just list tasks)
async function listTasks () {
    let exec = require(`child_process`).exec;

    exec(`gulp --tasks`, function (error, stdout, stderr) {
        if (error) process.stdout.write(`Error in exec.\n`);
        if (stderr) process.stdout.write(`stderr received.\n`);
        process.stdout.write(`\nAvailable tasks:\n\n${stdout}`);
    });
}

// Exports
exports.brave = series(brave, serve);
exports.chrome = series(chrome, serve);
exports.edge = series(edge, serve);
exports.firefox = series(firefox, serve);
exports.opera = series(opera, serve);
exports.safari = series(safari, serve);
exports.vivaldi = series(vivaldi, serve);
exports.allBrowsers = series(allBrowsers, serve);
exports.clean = clean;
exports.lintCSS = lintCSS;
exports.lintJS = lintJS;
exports.transpileJSForDev = transpileJSForDev;
exports.copyCSSToTemp = copyCSSToTemp;
exports.copyHTMLToTemp = copyHTMLToTemp;

// DEV
exports.serve = series(
    lintCSS,
    copyCSSToTemp,
    lintJS,
    transpileJSForDev,
    copyHTMLToTemp,
    serve
);

// PROD
exports.build = series(
    clean,
    compressHTML,
    minifyCSS,
    transpileJSForProd,
    copyAssetsToProd
);

// Default help
exports.default = listTasks;
