all: \
	news/cyvasse-online-beta.html \
	news/we-re-on-facebook-now.html \
	news/forum-up-and-running.html \
	\
	rule-sets/mikelepage.html \
	\
	static-text/what-is-cyvasse.html

%.html : %.md
	@mkdir -p $(@D)
	$(AM_V_GEN)$(MARKDOWN) -x tables -f $@ $<
