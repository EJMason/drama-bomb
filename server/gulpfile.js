const path = require('path')
const fs = require('fs')

const gulp = require('gulp')
const run = require('gulp-run')
const del = require('del')
const bump = require('gulp-bump')
const inquirer = require('inquirer')
const gutil = require('gulp-util')
const git = require('gulp-git')
const runSequence = require('run-sequence')

const releaseTypes = ['patch', 'minor', 'major']
const BUILD_DIR = path.resolve(__dirname, '..', 'client', 'build')

let version


const getPackageJsonVersion = () =>
  JSON
    .parse(fs.readFileSync('./package.json', 'utf8'))
    .version



/*
bump-version
clean-build

*/

gulp.task('bump-version', done => {
  gutil.log(gutil.colors.bgBlue.black('GO Bump Version!'))
  inquirer
    .prompt({
      type: 'list',
      name: 'name',
      message: '\nChoose Release Type -->',
      choices: releaseTypes,
    })
    .then(resp => {
      version = resp.name

      gulp
        .src(['./package.json'])
        .pipe(bump({ type: `${version}` })
        .on('error', err => { gutil.log(gutil.colors.magenta(`Durr... error: ${err}`)) }))
        .pipe(gulp.dest('./'))
      done()
    })
})

// Remove the build folder, then rebuild
gulp.task('clean-build', () => {
  gutil.log(gutil.colors.bgBlue.black('GO Build!'))
  gutil.log(`${BUILD_DIR}/**/*`)
  del([`${BUILD_DIR}/**/*`], { force: true })
    .then(() => {
      return run('yarn run build', { cwd: '/Users/ejm/Desktop/drama-bomb/client' })
        .exec()
    })
})

gulp.task('commit-changes', () => {
  gutil.log(gutil.colors.bgBlue.black('GO Commit Changes!'))
  return gulp.src('../')
    .pipe(git.add())
    .pipe(git.commit(`[Release-${version}] Bumped version ${getPackageJsonVersion()}`))
})

gulp.task('push-changes', done => {
  gutil.log(gutil.colors.bgBlue.black('GO Push Changes!'))
  git.push('origin', 'master:deploy', done)
})

gulp.task('execute', done => {
  gutil.log(gutil.colors.bgBlue.black('GO Execute!'))
  runSequence('bump-version',
    'clean-build',
    'commit-changes',
    'push-changes',
    done)
})

// run ansible

gulp.task('default', ['execute'])
