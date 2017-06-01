const path = require('path')
const fs = require('fs')
const del = require('del')
const inquirer = require('inquirer')

const gulp = require('gulp')
const run = require('gulp-run')
const bump = require('gulp-bump')
const gutil = require('gulp-util')
const git = require('gulp-git')
const notify = require('gulp-notify')

const runSequence = require('run-sequence')

let version
const releaseTypes = ['patch', 'minor', 'major']
const ANSIBLE_DIR = path.resolve(__dirname, '..', 'ansible')
const BUILD_DIR = path.resolve(__dirname, '..', 'client', 'build')
const CLIENT_DIR = path.resolve(__dirname, '..', 'client')

const getPackageJsonVersion = () =>
  JSON
    .parse(fs.readFileSync('./package.json', 'utf8'))
    .version

gulp.src("./src/test.ext")
  .pipe(notify("Hello Gulp!"))
// --------------------------------------------------------
//                    Gulp Tasks (in-order)
// --------------------------------------------------------
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
gulp.task('clean-build', done => {
  gutil.log(gutil.colors.bgBlue.black('GO Build!'))
  gutil.log(`${BUILD_DIR}/**/*`)
  del([`${BUILD_DIR}/**/*`], { force: true })
    .then(() => {
      run('yarn run build', { cwd: CLIENT_DIR })
        .exec(() => {
          done()
        })
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

gulp.task('ansible', () => {
  gutil.log(gutil.colors.bgMagenta.black('Ready, Go Ansible!'))
  return run('ansible-playbook playbook.yml', { cwd: ANSIBLE_DIR })
    .exec()
})

gulp.task('notification', () => {
  return gulp
    .src('./')
    .pipe(notify({ message: '(つ°ヮ°)つ  └⋃┘ .....done' }))
})


// --------------------------------------------------------
//                    Gulp Executer
// --------------------------------------------------------

gulp.task('execute', done => {
  gutil.log(gutil.colors.bgBlue.black('GO Execute!'))
  runSequence('bump-version',
    'clean-build',
    'commit-changes',
    'push-changes',
    'ansible',
    'notification',
    done)
})

gulp.task('nobuild', done => {
  gutil.log(gutil.colors.bgBlue.black('GO Execute!'))
  runSequence('bump-version',
    'commit-changes',
    'push-changes',
    'ansible',
    'notification',
    done)
})

gulp.task('default', ['execute'])
