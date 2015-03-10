AUTOMAKE_OPTIONS = subdir-objects

bin_PROGRAMS = cyvasse-online

cyvasse_online_ecpp_sources = \
	ecpp/404.ecpp \
	ecpp/500.ecpp \
	ecpp/game.ecpp \
	ecpp/index.ecpp \
	ecpp/legal.ecpp \
	ecpp/page.ecpp \
	ecpp/rule-set.ecpp

BUILT_SOURCES = \
	$(cyvasse_online_ecpp_sources:.ecpp=.cpp)

cyvasse_online_SOURCES = \
	main.cpp \
	page-json.cpp \
	pagemeta_reader.cpp \
	pagemeta_reader.hpp \
	$(cyvasse_online_ecpp_sources)

cyvasse_online_CXXFLAGS = \
	$(JSONCPP_CFLAGS)

cyvasse_online_LDADD = \
	$(JSONCPP_LIBS) \
	-lcxxtools \
	-ltntdb \
	-ltntnet \
	-lyaml-cpp

nodist_cyvasse_online_SOURCES = \
	$(cyvasse_online_ecpp_sources:.ecpp=.cpp)

CLEANFILES = \
	$(cyvasse_online_ecpp_sources:.ecpp=.cpp) \
	$(cyvasse_online_ecpp_sources:.ecpp=.deps)

ECPPFLAGS = \
	-I$(top_builddir)/resources/static-text \
	-I$(srcdir)/ecpp/include

ecpp/%.cpp: ecpp/%.ecpp
	$(AM_V_GEN)$(ECPPC) $(ECPPFLAGS) -n "$*" -m text/html -o $@ $<
%.deps: %.ecpp
	$(AM_V_GEN)$(ECPPC) -M $(ECPPFLAGS) $< | $(SED) '1s/\(.*\).cpp:/\1.cpp \1.deps:/' > $@

-include $(cyvasse_online_ecpp_sources:.ecpp=.deps)
