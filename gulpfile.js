var gulp = require('gulp');
var request = require('request');
var fs = require('fs');
var nuget = require('gulp-nuget');
var request = require('request');
var child_process = require('child_process');
var msbuild = require('gulp-msbuild');
var assemblyInfo = require('gulp-dotnet-assembly-info');
var argv = require('yargs')
        .default('version', '1.0.0').argv;
var del = require('del');

gulp.task('retrieve', ['restore:nuget', 'restore:dockerImage']);
gulp.task('build', ['build:csharp', 'build:dockerImage'])

gulp.task('clean', ()=>{
    return del(['nuget.exe', 'packages', 'WebForms1/output'])
});

gulp.task('download:nuget', ['clean'] ,(cb)=>{
    return request('http://nuget.org/nuget.exe')
            .pipe(fs.createWriteStream('nuget.exe'));
});

gulp.task('restore:nuget', ['clean','download:nuget'], ()=>{
    return gulp.src('WebForms1.sln')
            .pipe(nuget.restore({ nuget: "./nuget.exe" }));
});

gulp.task('restore:dockerImage', ()=>{
    //so help my soul for making this sync
    child_process.execSync('docker pull microsoft/aspnet', {stdio: 'inherit'})
});

gulp.task('build:patchAssemblyInfo', function() {
    gulp.src(['**/AssemblyInfo.cs', '!packages/**'])
        .pipe(assemblyInfo({
            title: 'Planet Express Website',
            description: 'Shipping and tracking website.', 
            configuration: 'Release', 
            company: 'Planet Express', 
            product: 'Planet Express Website', 
            copyright: 'Copyright 3002 © Planet Express', 
            trademark: 'Planet Express', 
            culture: 'en-us',
            version: function(value) { return argv.version },
            fileVersion: function(value) { return argv.version; },
        }))
        .pipe(gulp.dest('.'));
});


gulp.task('build:csharp', ['retrieve', 'build:patchAssemblyInfo'], ()=>{
    return gulp.src("./WebForms1/WebForms1.csproj")
        .pipe(msbuild({
            targets: ['Clean', 'Build'],
            properties: { Configuration: 'Release', DeployOnBuild: 'true', PublishProfile: '.\\p.pubxml' },
            toolsVersion: 14
            })
        );
});

gulp.task('build:dockerImage', ['build:csharp', 'restore:dockerImage'], ()=>{
    //so help my soul for making this sync
    child_process.execSync(`docker build -t tparnell/mywebforms:${argv.version} .`, {stdio: 'inherit', cwd: "./WebForms1/output"})
});