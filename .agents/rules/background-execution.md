# Background Execution & Tool Polling

Long foreground calls may auto-background by the configured threshold; the result is injected as a follow-up when the job finishes. NEVER poll a backgrounded job (`sleep`/`ps`/`pgrep`/`top`) - do other work or end your reply and you will be woken with its output.
