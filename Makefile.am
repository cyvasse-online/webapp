ACLOCAL_AMFLAGS = -I m4

AUTOMAKE_OPTIONS = subdir-objects

AM_CXXFLAGS = \
	-std=c++11

bin_PROGRAMS = cyvasse-online

cyvasse_online_ecpp_sources = \
	src/ecpp/404.ecpp \
	src/ecpp/500.ecpp \
	src/ecpp/index.ecpp \
	src/ecpp/game.ecpp \
	src/ecpp/page.ecpp

BUILT_SOURCES = $(cyvasse_online_ecpp_sources:.ecpp=.cpp)

cyvasse_online_SOURCES = \
	src/main.cpp \
	$(cyvasse_online_ecpp_sources)

nodist_cyvasse_online_SOURCES = $(cyvasse_online_ecpp_sources:.ecpp=.cpp)

cyvasse_online_LDADD = \
	-lcxxtools \
	-ltntnet

CLEANFILES = $(cyvasse_online_ecpp_sources:.ecpp=.cpp) $(cyvasse_online_ecpp_sources:.ecpp=.deps)

ECPPFLAGS = -I $(top_srcdir)/src/ecpp/include

src/ecpp/%.cpp: src/ecpp/%.ecpp
	$(AM_V_GEN)$(ECPPC) $(ECPPFLAGS) -n "$*" -m text/html -o $@ $<
%.deps: %.ecpp
	$(AM_V_GEN)$(ECPPC) -M $(ECPPFLAGS) $< | $(SED) '1s/\(.*\).cpp:/\1.cpp \1.deps:/' > $@

-include $(cyvasse_online_ecpp_sources:.ecpp=.deps)
