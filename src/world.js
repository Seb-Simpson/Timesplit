export class World {
    constructor(blockSize, chunkSize = 10, dimensions = [5, 5], height = 40) {
        this.HEIGHT = height;
        this.DIMENSIONS = { x : dimensions[0], z : dimensions[1] };
        this.BLOCK_SIZE = blockSize;
        this.CHUNK_SIZE = chunkSize;
        this.chunks = new Map();
        this.generate();
    }

    generate() {
        for (let cx = 0; cx < this.DIMENSIONS.x; cx++) {
            for (let cz = 0; cz < this.DIMENSIONS.z; cz++) {
                const key = this.getChunkKey(cx, cz);
                const chunk = new Chunk(this.CHUNK_SIZE, this.HEIGHT);
                this.chunks.set(key, chunk);
            }
        }
    }

    getChunkKey(cx, cz) {
        return `${cx},${cz}`;
    }

    getChunk(cx, cz) {
        const key = this.getChunkKey(cx, cz);
        return this.chunks.get(key);
    }

    findChunk(x, z) {
        const cx = Math.floor(x / this.CHUNK_SIZE);
        const cz = Math.floor(z / this.CHUNK_SIZE);

        return this.getChunk(cx, cz);
    }

    localize(x, y, z) {
        const lx = ((x % this.CHUNK_SIZE) + this.CHUNK_SIZE) % this.CHUNK_SIZE;
        const lz = ((z % this.CHUNK_SIZE) + this.CHUNK_SIZE) % this.CHUNK_SIZE;

        return [lx, y, lz];
    }

    getBlock(x, y, z) {
        const chunk = this.findChunk(x, z);
        const coords = this.localize(x, y, z);
        return chunk.getBlock(...coords);
    }

    setBlock(x, y, z, type) {
        const chunk = this.findChunk(x, z);
        const coords = this.localize(x, y, z);
        chunk.setBlock(...coords, type);
    }

    isAir(x, y, z) {
        const chunk = this.findChunk(x, z);
        const coords = this.localize(x, y, z);
        return chunk.isAir(...coords);
    }
}

class Chunk {
    constructor(size, height) {
        this.size = size;
        this.height = height;
        this.blocks = this.generate();
    }

    generate() {
        let blocks = [];
        for (let y = 0; y < this.height; y++) {
            let layer = [];
            let type;

            if (y === this.height - 1) {
                type = 1;
            } else if (y > this.height - 4) {
                type = 2;
            } else {
                type = 3;
            }

            for (let z = 0; z < this.size; z++) {
                let strip = [];
                for (let x = 0; x < this.size; x++) {
                    strip.push(type);
                }
                layer.push(strip);
            }
            blocks.push(layer);
        }
        return blocks;
    }

    getBlock(lx, y, lz) {
        return this.blocks[y][lz][lx];
    }

    setBlock(lx, y, lz, type) {
        this.blocks[y][lz][lx] = type;
    }

    isAir(lx, y, lz) {
        return this.getBlock(lx, y, lz) === 0;
    }
}