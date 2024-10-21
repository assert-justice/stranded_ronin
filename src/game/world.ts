import { HashGrid2D } from "../libs/core/data";
import { Ldtk } from "../libs/ldtk/ldtk";

export class World{
    rooms: Set<Room>;
    sectorLookup: HashGrid2D<Sector | undefined>;
    cellWidthPx: number;
    sectorWidthCells: number;
    sectorHeightCells: number;
    constructor(rooms: Set<Room>, sectorLookup: HashGrid2D<Sector | undefined>, cellWidthPx: number, sectorWidthCells: number, sectorHeightCells: number){
        this.rooms = rooms;
        this.sectorLookup = sectorLookup;
        this.cellWidthPx = cellWidthPx;
        this.sectorWidthCells = sectorWidthCells;
        this.sectorHeightCells = sectorHeightCells;
    }
    static fromLdtk(data: Ldtk){
        const cellWidthPx = data.defaultGridSize;
        const sectorWidthPx = (data.defaultLevelWidth ?? 0) / cellWidthPx;
        const sectorHeightPx = (data.defaultLevelHeight ?? 0) / cellWidthPx;
        const sectorWidthCells = sectorWidthPx / cellWidthPx;
        const sectorHeightCells = sectorHeightPx / cellWidthPx;
        const rooms = new Set<Room>();
        const sectorLookup = new HashGrid2D<Sector | undefined>(undefined);
        for (const level of data.levels) {
            const roomWidthSectors = level.pxWid / sectorWidthPx;
            const roomHeightSectors = level.pxHei / sectorHeightPx;
            const roomWidthCells = roomWidthSectors * sectorWidthCells;
            const roomHeightCells = roomHeightSectors * sectorHeightCells;
            const roomXSectors = level.worldX / sectorWidthPx;
            const roomYSectors = level.worldY / sectorHeightPx;
            const layers = level.layerInstances;
            if(!layers) throw 'validation error';
            const intGrid = layers[0].intGridCsv;
            for(let idx = 0; idx < intGrid.length; idx++){
                const cx = idx % roomWidthCells;
                const cy = Math.floor(idx / roomHeightCells);
                const sx = Math.floor(cx / sectorWidthCells) + roomXSectors;
                const sy = Math.floor(cy / sectorHeightCells) + roomYSectors;
                let sector = sectorLookup.get(sx, sy);
                if(!sector){
                    sector = {posX: sx, posY: sy, cells: []};
                    sectorLookup.set(sx, sy, sector);
                }
                sector.cells.push(intGrid[idx]);
            }
            rooms.add({posX: roomXSectors, posY: roomYSectors, width: roomWidthSectors, height: roomHeightSectors, properties: new Map()});
        }
        return new World(rooms, sectorLookup, cellWidthPx, sectorWidthCells, sectorHeightCells);
    }
}

interface Room{
    posX: number;
    posY: number;
    width: number;
    height: number;
    properties: Map<string, string>;
}

interface Sector{
    posX: number;
    posY: number;
    cells: number[];
}