all: \
	cyvasse-online-beta.html \
	we-re-on-facebook-now.html \
	forum-up-and-running.html

%.html : %.md
	$(AM_V_GEN)$(MARKDOWN) -f $@ $<
