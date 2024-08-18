class PropertiesPanel {
	constructor(holderDiv) {
		this.holderDiv = holderDiv;

		const panelHeaderDiv = createDOMElement("div", {
			class: "panel-head",
		});
		panelHeaderDiv.innerText = "Properties";

		const panelBodyDiv = createDOMElement("div", {
			class: "panel-body",
			["data-title"]: "Properties",
		});

		this.holderDiv.appendChild(panelHeaderDiv);
		this.holderDiv.appendChild(panelBodyDiv);

		const transformSection = createDOMElement("div", {
			class: "panel-section",
			["data-title"]: "Transform",
		});
		const colorSection = createDOMElement("div", {
			class: "panel-section grid",
			["data-title"]: "Color",
		});
		const textSection = createDOMElement("div", {
			class: "panel-section grid",
			["data-title"]: "Text",
		});

		panelBodyDiv.appendChild(transformSection);
		panelBodyDiv.appendChild(colorSection);
		panelBodyDiv.appendChild(textSection);

		transformSection.appendChild(
			createInputWithLabel("X", {
				type: "number",
				onchange: "PropertiesPanel.changeX(this.value)",
				onfocus: "PropertiesPanel.selectText(this)",
				onwheel: "PropertiesPanel.changeValue(event)",
				id: "xInput",
			})
		);
		transformSection.appendChild(
			createInputWithLabel("Y", {
				type: "number",
				onchange: "PropertiesPanel.changeY(this.value)",
				onfocus: "PropertiesPanel.selectText(this)",
				onwheel: "PropertiesPanel.changeValue(event)",
				id: "yInput",
			})
		);
		transformSection.appendChild(
			createInputWithLabel("Width", {
				type: "number",
				onchange: "PropertiesPanel.changeWidth(this.value)",
				onfocus: "PropertiesPanel.selectText(this)",
				onwheel: "PropertiesPanel.changeValue(event)",
				id: "widthInput",
			})
		);
		transformSection.appendChild(
			createInputWithLabel("Height", {
				type: "number",
				onchange: "PropertiesPanel.changeHeight(this.value)",
				onfocus: "PropertiesPanel.selectText(this)",
				onwheel: "PropertiesPanel.changeValue(event)",
				id: "heightInput",
			})
		);
		transformSection.appendChild(
			createInputWithLabel("Rotation", {
				type: "input",
				onblur: "PropertiesPanel.setRotation(this.value)",
				onchange: "PropertiesPanel.setRotation(this.value, true)",
				onfocus: "PropertiesPanel.setRotation(this.value, true)",
				onwheel: "PropertiesPanel.changeValue(event)",
				id: "rotationInput",
			})
		);
		transformSection.appendChild(
			createInputWithLabel("Constrain", {
				type: "checkbox",
				id: "constrainDimensions",
			})
		);
		colorSection.appendChild(
			createDOMElement("input", {
				id: "fillColor",
				onchange: "PropertiesPanel.changeFillColor(this.value)",
				oninput: "PropertiesPanel.previewFillColor(this.value)",
				title: "Fill Color",
				type: "color",
			})
		);
		colorSection.appendChild(
			createDOMElement("input", {
				id: "toggleFill",
				checked: true,
				onchange: "PropertiesPanel.toggleFill(this.checked)",
				title: "Fill",
				type: "checkbox",
			})
		);
		colorSection.appendChild(
			createDOMElement(
				"button",
				{ id: "resetBtn", onclick: "PropertiesPanel.resetColors()" },
				"Reset"
			)
		);
		colorSection.appendChild(
			createDOMElement("input", {
				id: "strokeColor",
				onchange: "PropertiesPanel.changeStrokeColor(this.value)",
				oninput: "PropertiesPanel.previewStrokeColor(this.value)",
				title: "Stroke Color",
				type: "color",
			})
		);
		colorSection.appendChild(
			createDOMElement("input", {
				id: "toggleStroke",
				checked: true,
				onchange: "PropertiesPanel.toggleStroke(this.checked)",
				title: "Stroke",
				type: "checkbox",
			})
		);
		colorSection.appendChild(
			createDOMElement(
				"button",
				{ id: "swapBtn", onclick: "PropertiesPanel.swapColors()" },
				"Swap"
			)
		);
		colorSection.appendChild(
			createDOMElement("input", {
				id: "strokeWidthRange",
				max: "100",
				min: "1",
				onchange: "PropertiesPanel.changeStrokeWidthRange(this.value)",
				oninput: "PropertiesPanel.previewStrokeWidthRange(this.value)",
				title: "Stroke Width",
				type: "range",
				value: "5",
			})
		);
		colorSection.appendChild(
			createInputWithLabel("", {
				type: "number",
				onchange: "PropertiesPanel.changeStrokeWidth(this.value)",
				onfocus: "PropertiesPanel.selectText(this)",
				onwheel: "PropertiesPanel.changeValue(event)",
				oninput: "PropertiesPanel.previewStrokeWidth(this.value)",
				id: "strokeWidth",
			})
		);
		textSection.appendChild(
			createDOMElement("input", {
				id: "text",
				oninput: "PropertiesPanel.changeText(this.value)",
				onfocus: "PropertiesPanel.selectText(this)",
				title: "Stroke Width",
				type: "text",
				value: "TEST",
			})
		);

		PropertiesPanel.resetColors();
	}

	static selectText(element) {
		element.select();
	}

	static changeValue(event) {
		event.preventDefault();

		const element = event.target;

		if (getValue(element) === "") {
			throw new Error("No value to update!");
		}

		let value = Number(getValue(element).replace(/[^\d.-]+/, ""));

		if (event.shiftKey) {
			value += Math.sign(event.deltaX) * -10;
		} else if (event.altKey) {
			value += Math.sign(event.deltaY) * -0.1;
		} else {
			value += Math.sign(event.deltaY) * -1;
		}

		value = preciseFloat(value);

		setValue(element, value);
		fireEvent(element, "change");
	}

	static changeX(value) {
		shapes
			.filter((s) => s.selected)
			.forEach((s) => (s.center.x = Number(value) + STAGE_PROPERTIES.left));

		HistoryTools.record(shapes);
		viewport.drawShapes(shapes);
	}

	static changeY(value) {
		shapes
			.filter((s) => s.selected)
			.forEach((s) => (s.center.y = Number(value) + STAGE_PROPERTIES.top));

		HistoryTools.record(shapes);
		viewport.drawShapes(shapes);
	}

	static changeWidth(value) {
		const newWidth = Math.max(Number(value), 1);
		let newHeight = 0;

		shapes
			.filter((s) => s.selected)
			.forEach((s) => {
				const currentWidth = s.size.width;
				const currentHeight = s.size.height;
				newHeight = currentHeight;

				if (constrainDimensions.checked) {
					const aspectRatio = currentWidth / currentHeight;
					const constrainedHeight = newWidth / aspectRatio;
					newHeight = constrainedHeight;

					if (getValue(heightInput) != "") {
						setValue(heightInput, preciseFloat(newHeight));
					}
				}

				s.setSize(newWidth, newHeight);
			});

		setValue(widthInput, preciseFloat(newWidth));
		HistoryTools.record(shapes);
		viewport.drawShapes(shapes);
	}

	static changeHeight(value) {
		const newHeight = Math.max(Number(value), 1);
		let newWidth = 0;

		shapes
			.filter((s) => s.selected)
			.forEach((s) => {
				const currentWidth = s.size.width;
				const currentHeight = s.size.height;
				newWidth = currentWidth;

				if (constrainDimensions.checked) {
					const aspectRatio = currentWidth / currentHeight;
					const constrainedWidth = newHeight * aspectRatio;
					newWidth = constrainedWidth;

					if (getValue(widthInput) != "") {
						setValue(widthInput, preciseFloat(newWidth));
					}
				}

				s.setSize(newWidth, newHeight);
			});

		setValue(heightInput, preciseFloat(newHeight));
		HistoryTools.record(shapes);
		viewport.drawShapes(shapes);
	}

	static setRotation(value, isFocus = false) {
		value = Number(value.replace(/[^\d.-]+/, ""));
		const newValue = value % 360;

		shapes
			.filter((s) => s.selected)
			.forEach((s) => {
				s.setRotation(newValue);
			});

		if (isFocus) {
			setValue(rotationInput, newValue);
			PropertiesPanel.selectText(rotationInput);
		} else {
			setValue(rotationInput, `${newValue}°`);
		}

		HistoryTools.record(shapes);
		viewport.drawShapes(shapes);
	}

	static previewFillColor(value) {
		shapes
			.filter((s) => s.selected)
			.forEach((s) => (s.options.fillColor = value));

		viewport.drawShapes(shapes);
	}

	static changeFillColor(value) {
		PropertiesPanel.previewFillColor(value);
		HistoryTools.record(shapes);
	}

	static toggleFill(value) {
		shapes.filter((s) => s.selected).forEach((s) => (s.options.fill = value));

		HistoryTools.record(shapes);
		viewport.drawShapes(shapes);
	}

	static previewStrokeColor(value) {
		shapes
			.filter((s) => s.selected)
			.forEach((s) => (s.options.strokeColor = value));

		viewport.drawShapes(shapes);
	}

	static changeStrokeColor(value) {
		PropertiesPanel.previewStrokeColor(value);
		HistoryTools.record(shapes);
	}

	static toggleStroke(value) {
		shapes
			.filter((s) => s.selected)
			.forEach((s) => (s.options.stroke = value));

		if (value) {
			removeProperty(strokeWidthRange, "disabled");
			removeProperty(strokeWidth, "disabled");
		} else {
			setProperty(strokeWidthRange, "disabled", "true");
			setProperty(strokeWidth, "disabled", "true");
		}

		HistoryTools.record(shapes);
		viewport.drawShapes(shapes);
	}

	static previewStrokeWidthRange(value) {
		shapes
			.filter((s) => s.selected)
			.forEach((s) => (s.options.strokeWidth = Number(value)));

		setValue(strokeWidth, value);

		viewport.drawShapes(shapes);
	}

	static changeStrokeWidthRange(value) {
		PropertiesPanel.previewStrokeWidthRange(value);
		HistoryTools.record(shapes);
	}

	static previewStrokeWidth(value) {
		PropertiesPanel.changeStrokeWidth(value);
	}

	static changeStrokeWidth(value) {
		setValue(strokeWidthRange, value);
		PropertiesPanel.previewStrokeWidthRange(value);
	}

	static changeText(value) {
		shapes
			.filter((s) => s.selected && s.text !== undefined)
			.forEach((s) => s.setText(value));

		HistoryTools.record(shapes);
		viewport.drawShapes(shapes);
	}

	static resetColors() {
		fillColor.value = "#ffffff";
		strokeColor.value = "#000000";
		PropertiesPanel.changeFillColor(fillColor.value);
		PropertiesPanel.changeStrokeColor(strokeColor.value);
	}

	static swapColors() {
		const fillStyle = fillColor.value;
		const strokeStyle = strokeColor.value;

		fillColor.value = strokeStyle;
		strokeColor.value = fillStyle;

		PropertiesPanel.changeFillColor(fillColor.value);
		PropertiesPanel.changeStrokeColor(strokeColor.value);
	}

	static reset() {
		xInput.value = "";
		rotationInput.value = "";
		yInput.value = "";
		widthInput.value = "";
		heightInput.value = "";
		constrainDimensions.checked = false;
		toggleFill.checked = true;
		toggleStroke.checked = true;
		text.value = "";
		xInput.placeholder = "";
		yInput.placeholder = "";
		widthInput.placeholder = "";
		heightInput.placeholder = "";
		rotationInput.placeholder = "";
	}

	static getValues() {
		return {
			fillColor: fillColor.value,
			strokeColor: strokeColor.value,
			fill: toggleFill.checked,
			stroke: toggleStroke.checked,
			strokeWidth: Number(strokeWidthRange.value),
			lineCap: "round",
			lineJoin: "round",
		};
	}

	static updateDisplay(selectedShapes) {
		if (selectedShapes.length === 0) {
			PropertiesPanel.reset();
			return;
		}

		let newProperties = null;
		for (const shape of selectedShapes) {
			if (newProperties === null) {
				newProperties = {
					x: shape.center.x - STAGE_PROPERTIES.left,
					y: shape.center.y - STAGE_PROPERTIES.top,
					width: shape.size.width,
					height: shape.size.height,
					fillColor: shape.options.fillColor,
					fill: shape.options.fill,
					strokeColor: shape.options.strokeColor,
					stroke: shape.options.stroke,
					strokeWidth: shape.options.strokeWidth,
					text: shape.text,
					rotationAngle: shape.rotation,
				};
			} else {
				if (newProperties.x !== shape.center.x - STAGE_PROPERTIES.left) {
					newProperties.x = null;
				}
				if (newProperties.y !== shape.center.y - STAGE_PROPERTIES.top) {
					newProperties.y = null;
				}
				if (newProperties.width !== shape.size.width) {
					newProperties.width = null;
				}
				if (newProperties.height !== shape.size.height) {
					newProperties.height = null;
				}
				if (newProperties.fillColor !== shape.options.fillColor) {
					newProperties.fillColor = null;
				}
				if (newProperties.fill !== shape.options.fill) {
					newProperties.fill = null;
				}
				if (newProperties.strokeColor !== shape.options.strokeColor) {
					newProperties.strokeColor = null;
				}
				if (newProperties.stroke !== shape.options.stroke) {
					newProperties.stroke = null;
				}
				if (newProperties.strokeWidth !== shape.options.strokeWidth) {
					newProperties.strokeWidth = null;
				}
				if (newProperties.text !== shape.text) {
					newProperties.text = null;
				}
				if (newProperties.rotationAngle !== shape.rotation) {
					newProperties.rotationAngle = null;
				}
			}
		}
		if (newProperties === null) {
			return;
		} else {
			xInput.value = newProperties.x ? Math.round(newProperties.x) : "";
			yInput.value = newProperties.y ? Math.round(newProperties.y) : "";
			widthInput.value = newProperties.width
				? Math.round(newProperties.width)
				: "";
			heightInput.value = newProperties.height
				? Math.round(newProperties.height)
				: "";
			fillColor.value = newProperties.fillColor
				? newProperties.fillColor
				: "";
			toggleFill.checked = newProperties.fill ? newProperties.fill : false;
			strokeColor.value = newProperties.strokeColor
				? newProperties.strokeColor
				: "";
			toggleStroke.checked = newProperties.stroke
				? newProperties.stroke
				: false;
			strokeWidth.value = newProperties.strokeWidth
				? newProperties.strokeWidth
				: "";
			strokeWidthRange.value = newProperties.strokeWidth
				? newProperties.strokeWidth
				: "";
			text.value = newProperties.text ? newProperties.text : "";
			rotationInput.value =
				`${Math.round(newProperties.rotationAngle)}°` ?? "";

			const placeholderText = "Multiple Values";
			xInput.placeholder = newProperties.x ? "" : placeholderText;
			yInput.placeholder = newProperties.y ? "" : placeholderText;
			widthInput.placeholder = newProperties.width ? "" : placeholderText;
			heightInput.placeholder = newProperties.height ? "" : placeholderText;
			fillColor.placeholder = newProperties.fillColor ? "" : placeholderText;
			strokeColor.placeholder = newProperties.strokeColor
				? ""
				: placeholderText;
			strokeWidthRange.placeholder = newProperties.strokeWidth
				? ""
				: placeholderText;
			strokeWidth.placeholder = newProperties.strokeWidth
				? ""
				: placeholderText;
			text.placeholder = newProperties.text ? "" : placeholderText;
			rotationInput.placeholder = newProperties.rotationAngle
				? ""
				: placeholderText;
		}
	}
}
