all: \
	mikelepage.html

%.html : %.md
	$(AM_V_GEN)$(MARKDOWN) -x tables -f $@ $<
