SUBDIRS = news .

AUTOMAKE_OPTIONS = subdir-objects

AM_CXXFLAGS = \
	-std=c++11

bin_PROGRAMS = cyvasse-online

cyvasse_online_ecpp_sources = \
	ecpp/404.ecpp \
	ecpp/500.ecpp \
	ecpp/create.ecpp \
	ecpp/index.ecpp \
	ecpp/game.ecpp \
	ecpp/page.ecpp

BUILT_SOURCES = $(cyvasse_online_ecpp_sources:.ecpp=.cpp)

cyvasse_online_SOURCES = \
	main.cpp \
	$(cyvasse_online_ecpp_sources)

nodist_cyvasse_online_SOURCES = $(cyvasse_online_ecpp_sources:.ecpp=.cpp)

cyvasse_online_LDADD = \
	-lcxxtools \
	-ltntnet \
	-lyaml-cpp

CLEANFILES = $(cyvasse_online_ecpp_sources:.ecpp=.cpp) $(cyvasse_online_ecpp_sources:.ecpp=.deps)

ECPPFLAGS = -I $(srcdir)/ecpp/include

ecpp/%.cpp: ecpp/%.ecpp
	$(AM_V_GEN)$(ECPPC) $(ECPPFLAGS) -n "$*" -m text/html -o $@ $<
%.deps: %.ecpp
	$(AM_V_GEN)$(ECPPC) -M $(ECPPFLAGS) $< | $(SED) '1s/\(.*\).cpp:/\1.cpp \1.deps:/' > $@

-include $(cyvasse_online_ecpp_sources:.ecpp=.deps)