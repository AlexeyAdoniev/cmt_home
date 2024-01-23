class Virtualizer {
	static create(listSize, height, root) {
		return new Virtualizer(listSize, height, root);
	}

	constructor(listSize = 0, height = 0, root = document.body) {
		this.listSize = listSize;
		this.height = height;
		this.root = root;
	}

	render() {
		this.root.style.height = this.listSize * this.height;
	}
}

export default Virtualizer;
