import { debounce } from './utils';

class Virtualizer {
	static create(listSize, item_height, table_id, header_height) {
		return new Virtualizer(listSize, item_height, table_id, header_height);
	}

	constructor(
		listSize = 0,
		item_height = 0,
		table_id = undefined,
		header_height
	) {
		this.listSize = listSize;
		this.item_height = item_height;
		this.table_id = table_id;
		this.header_height = header_height;
	}

	render() {
		this.root.style.height = this.listSize * this.height;
	}

	virtalize(ref, setScrollY) {
		const scrollHandler = () => {
			debounce(() => {
				setScrollY(window.scrollY);
			}, 50)();
		};

		const container = document.querySelector(
			`.table-container${this.table_id ? `-${this.table_id}` : ''}`
		);
		container.style.height = `${
			this.listSize * this.item_height +
			(this.table_id ? this.header_height : 0)
		}px`;
		const header = container
			.querySelector('table > thead')
			?.getBoundingClientRect();

		ref.current = header.y + header.height + window.scrollY;
		return scrollHandler;
	}

	static outOfBounds(index, scrollY, item_height, ref, groups) {
		const rowYOffset = index * item_height + ref.current;

		const topOutOfBounds = rowYOffset < scrollY;

		const closedGroups =
			groups?.reduce((acc, cur) => {
				return acc + cur.rows * item_height;
			}, 0) || 0;

		const botOutOfBodnds =
			rowYOffset > scrollY + window.innerHeight + 10 + closedGroups;

		const outOfBounds = botOutOfBodnds || topOutOfBounds;
		return { outOfBounds, topOutOfBounds, botOutOfBodnds };
	}
}

export default Virtualizer;
