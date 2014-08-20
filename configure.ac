AC_INIT([cyvasse-online-webapp],[0.1],[mail@jonasplatte.de])
AC_CONFIG_AUX_DIR([.])
AM_INIT_AUTOMAKE([1.11 foreign])
AM_SILENT_RULES([yes])
AC_PROG_CXX
AC_LANG(C++)

AC_CHECK_PROGS(ECPPC, [ecppc])
AC_CHECK_HEADER([tnt/tntnet.h], [], AC_MSG_ERROR([tntnet headers not found]))
AC_CHECK_HEADER([tntdb/connection.h], [], AC_MSG_ERROR([tntdb headers not found]))
AC_CHECK_HEADER([jsoncpp/json/json.h], [], AC_MSG_ERROR([jsoncpp headers not found]))
AC_CHECK_HEADER([yaml-cpp/yaml.h], [], AC_MSG_ERROR([yaml-cpp headers not found]))
AC_PROG_SED

# simply a markdown implementation available in the
# arch linux community repo which I had installed
AC_CHECK_PROGS(MARKDOWN, [markdown_py])

AC_CONFIG_FILES([
	Makefile
	config.yml
	news/Makefile
	rule_sets/Makefile
	src/Makefile
])
AC_CONFIG_LINKS([
	news.yml:$srcdir/news/news.yml
	static:$srcdir/src/static
	pagemeta.yml:$srcdir/src/pagemeta.yml
])

AC_OUTPUT
