var gulp = require('gulp');
var babel = require('gulp-babel');
var clean = require('gulp-clean');
 
gulp.task('build', function () {
    return gulp.src('src/**/*.js')
        .pipe(babel({
			"blacklist":["regenerator"],
			"compact": false,
			"optional": [
		      "es7",
		       "runtime"
		    ]
		}))
        .pipe(gulp.dest('lib'));
});

gulp.task('clean', function(){
	return gulp.src('lib', {read: false})
    	.pipe(clean());
});