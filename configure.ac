AC_INIT([cyvasse-online-webapp],[1.0.2],[mail@jonasplatte.de])
AC_CONFIG_AUX_DIR([.])
AC_CONFIG_MACRO_DIRS([m4])
AM_INIT_AUTOMAKE([foreign])
AM_SILENT_RULES([yes])

AC_PROG_CXX
AC_LANG(C++)
AX_CHECK_COMPILE_FLAG([-std=c++14], [CXXFLAGS="$CXXFLAGS -std=c++14"],
	AX_CHECK_COMPILE_FLAG([-std=c++1y], [CXXFLAGS="$CXXFLAGS -std=c++1y"],
		AX_CHECK_COMPILE_FLAG([-std=c++11], [CXXFLAGS="$CXXFLAGS -std=c++1y"],
			AX_CHECK_COMPILE_FLAG([-std=c++0x], [CXXFLAGS="$CXXFLAGS -std=c++1y"],
				AC_MSG_ERROR([Compiler doesn't support C++11])
			)
		)
	)
)
AX_CHECK_COMPILE_FLAG([-Wall], [CXXFLAGS="$CXXFLAGS -Wall"])
AX_CHECK_COMPILE_FLAG([-Wextra], [CXXFLAGS="$CXXFLAGS -Wextra"])
AX_CHECK_COMPILE_FLAG([-pedantic], [CXXFLAGS="$CXXFLAGS -pedantic"])

PKG_CHECK_MODULES([CXXTOOLS], [cxxtools])
PKG_CHECK_MODULES([TNTNET], [tntnet >= 2.3])
PKG_CHECK_MODULES([JSONCPP], [jsoncpp])

AC_CHECK_HEADER([yaml-cpp/yaml.h], [], AC_MSG_ERROR([yaml-cpp headers not found]))
AC_PROG_SED

# simply a markdown implementation available in the
# arch linux community repo which I had installed
AC_CHECK_PROGS(MARKDOWN, [markdown_py])
AS_IF([test -z "$MARKDOWN"], [
	AC_MSG_ERROR([markdown_py not found])
])

AC_CHECK_PROGS(ECPPC, [ecppc])
AS_IF([test -z "$ECPPC"], [
	AC_MSG_ERROR([ecppc not found])
])

AC_CHECK_PROGS(SASS, [sass])
AS_IF([test -z "$SASS"], [
	AC_MSG_ERROR([sass not found])
])

AC_CONFIG_FILES([
	Makefile
	config.yml
	log.xml
	resources/Makefile
	src/Makefile
])

AC_OUTPUT
