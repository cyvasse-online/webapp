AC_INIT([cyvasse-online-webapp],[0.1],[mail@jonasplatte.de])
AC_CONFIG_AUX_DIR([.])
AC_CONFIG_MACRO_DIRS([m4])
AM_INIT_AUTOMAKE([1.11 foreign])
AM_SILENT_RULES([yes])
AC_PROG_CXX
AC_LANG(C++)
AX_CXX_COMPILE_STDCXX_11(noext, mandatory)

AC_CHECK_HEADER([tnt/tntnet.h], [], AC_MSG_ERROR([tntnet headers not found]))
AC_CHECK_HEADER([tntdb/connection.h], [], AC_MSG_ERROR([tntdb headers not found]))
AC_CHECK_HEADER([yaml-cpp/yaml.h], [], AC_MSG_ERROR([yaml-cpp headers not found]))
AC_PROG_SED

PKG_CHECK_MODULES([JSONCPP], [jsoncpp])

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

AC_CONFIG_SUBDIRS([cyvasse-common])
AC_CONFIG_FILES([
	Makefile
	config.yml
	log.xml
	resources/Makefile
	src/Makefile
])
AC_CONFIG_LINKS([
	pagemeta.yml:$srcdir/src/pagemeta.yml
])

AC_OUTPUT
