AUTOMAKE_OPTIONS = subdir-objects

AM_CXXFLAGS = \
	-std=c++11

bin_PROGRAMS = cyvasse-online

cyvasse_online_ecpp_sources = \
	404.ecpp \
	500.ecpp \
	index.ecpp \
	page.ecpp

BUILT_SOURCES = $(cyvasse_online_ecpp_sources:.ecpp=.cpp)

cyvasse_online_SOURCES = \
	cpp_src/main.cpp \
	$(cyvasse_online_ecpp_sources)

nodist_cyvasse_online_SOURCES = $(cyvasse_online_ecpp_sources:.ecpp=.cpp)

cyvasse_online_LDADD = \
	-lcxxtools \
	-ltntnet

CLEANFILES = $(cyvasse_online_ecpp_sources:.ecpp=.cpp) $(cyvasse_online_ecpp_sources:.ecpp=.deps)

ECPPCFLAGS = -I $(top_srcdir)/webapp/include

%.cpp: %.ecpp
	$(AM_V_GEN)$(ECPPC) $(ECPPCFLAGS) -n "$*" -m text/html -o $@ $<
%.deps: %.ecpp
	$(AM_V_GEN)$(ECPPC) -M $(ECPPCFLAGS) $< | $(SED) '1s/\(.*\).cpp:/\1.cpp \1.deps:/' > $@

-include $(cyvasse_online_ecpp_sources:.ecpp=.deps)
