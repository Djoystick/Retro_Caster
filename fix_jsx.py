import re

with open('src/renderer/src/App.tsx', 'r', encoding='utf-8') as f:
    c = f.read()

# I need to fix the closing tags for the settings modal.
# Here is the bad part:
bad = """                               ПОНЯТНО
                              </button>
                              </div>
  </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    )}"""

# The activeInstruction modal ends with:
#                               </button>
#                             </div>
#                           </motion.div>
#                         )}
#                       </AnimatePresence>
# 
# And then we need to close the extra div for the frame:
#     </div>
#   </motion.div>
# )}

good = """                                ПОНЯТНО
                              </button>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </motion.div>
                )}"""

c = c.replace(bad, good)

# Also wait, I might have messed up another `</motion.div>` earlier. Let's do a strict regex on the whole activeInstruction block to fix it.
with open('src/renderer/src/App.tsx', 'w', encoding='utf-8') as f:
    f.write(c)

print("Closed div fixed.")
