var gulp = require('gulp');
var sass = require('gulp-sass');
gulp.task('sass', function() {
    return gulp.src('scss/**/*.scss') // Gets all files ending with .scss in app/scss
        .pipe(sass())
        .pipe(gulp.dest('public/stylesheets/'))

});
gulp.task('watch', [], function() {
    gulp.watch('scss/**/*.scss', ['sass']);
})
gulp.watch('scss/**/*.scss', ['sass']);