class ShapeTools {
	static tools = [
		{ name: "Path", class: PathTool, showButton: true, cursor: Cursor.PEN },
		{ name: "Rect", class: RectTool, showButton: true, cursor: Cursor.CURSOR_RECT },
		{ name: "Oval", class: OvalTool, showButton: true, cursor: Cursor.CURSOR_OVAL },
		{ name: "Text", class: TextTool, showButton: true, cursor: Cursor.TEXT_CURSOR },
		{ name: "Select", class: SelectTool, showButton: true, cursor: Cursor.DEFAULT },
		{ name: "Image", class: MyImageTool, showButton: false, cursor: Cursor.DEFAULT },
	];

	static cursor = Cursor.DEFAULT;

	static selectTool(type) {
		// Remove all event listeners
		ShapeTools.tools.forEach((tool) => tool.class.removeEventListeners());

		const tool = ShapeTools.tools.find((x) => x.name === type);
		ShapeTools.cursor = tool.cursor;

		// Add event listeners for the selected tool
		tool.class.configureEventListeners();

		// Dispatch an event to notify listeners the tool has been selected
		Events.toolSelected.dispatchEvent(
			new CustomEvent("toolSelected", { detail: tool })
		);

		return tool;
	}
}
