class Cursor {
	static CURSOR_OVAL = Cursor.getURL("cursor-oval");
	static CURSOR_RECT = Cursor.getURL("cursor-rect");
	static DEFAULT = Cursor.getURL("default", "4 4");
	static DROP_HIDDEN = Cursor.getURL("drop-hidden");
	static DROP = Cursor.getURL("drop");
	static EYES_CLOSED_ALT = Cursor.getURL("eyes-closed-alt");
	static EYES_CLOSED = Cursor.getURL("eyes-closed");
	static EYES_OPEN = Cursor.getURL("eyes-open");
	static LOCK = Cursor.getURL("lock");
	static MOVE_CROSS = Cursor.getURL("move-cross");
	static MOVE_EW = Cursor.getURL("move-ew");
	static MOVE_NESW = Cursor.getURL("move-nesw");
	static MOVE_NS = Cursor.getURL("move-ns");
	static MOVE_NWSE = Cursor.getURL("move-nwse");
	static MOVE = Cursor.getURL("move");
	static OVAL = Cursor.getURL("oval");
	static PATH = Cursor.getURL("path");
	static PEN = Cursor.getURL("pen", "6 6");
	static PENCIL = Cursor.getURL("pencil", "4 20");
	static RECTANGLE = Cursor.getURL("rectangle");
	static REDO = Cursor.getURL("redo");
	static ROTATE = Cursor.getURL("rotate");
	static TEXT_CURSOR_VERTICAL = Cursor.getURL("text-cursor-vertical");
	static TEXT_CURSOR = Cursor.getURL("text-cursor");
	static TEXT = Cursor.getURL("text");
	static TRASH = Cursor.getURL("trash");
	static UNDO = Cursor.getURL("undo");

	static getURL(cursor, hotspot = "12 12") {
		return `url(./assets/${cursor}.svg) ${hotspot}, default`;
	}
}
