import { steel, redAccent, glass, yellowAccent } from '../utils/materials.js';

export function createDropTower(THREE) {
    const group = new THREE.Group();
    group.name = 'DropTower';

    // Base
    const baseGeo = new THREE.CylinderGeometry(10, 10, 2, 32);
    const base = new THREE.Mesh(baseGeo, steel);
    base.position.y = 1;
    group.add(base);

    // Tower Column
    const columnGeo = new THREE.CylinderGeometry(2, 2, 60, 16);
    const column = new THREE.Mesh(columnGeo, steel);
    column.position.y = 30;
    group.add(column);

    // Passenger Ring
    const ringGeo = new THREE.TorusGeometry(3, 0.5, 16, 32);
    const ring = new THREE.Mesh(ringGeo, redAccent);
    ring.name = 'dropTowerRing';
    
    // Add seats
    for (let i = 0; i < 8; i++) {
        const angle = (i / 8) * Math.PI * 2;
        const seatGeo = new THREE.BoxGeometry(1, 1.5, 1);
        const seat = new THREE.Mesh(seatGeo, yellowAccent);
        seat.position.set(Math.cos(angle) * 3.5, 0, Math.sin(angle) * 3.5);
        ring.add(seat);
    }
    
    group.add(ring);

    // Animation
    // Drop tower goes up slowly, waits, drops fast.
    const times = [0, 5, 7, 8, 10];
    const positionTrack = new THREE.VectorKeyframeTrack(
        'dropTowerRing.position',
        times,
        [
            0, 5, 0,
            0, 55, 0,
            0, 55, 0,
            0, 5, 0,
            0, 5, 0
        ]
    );

    const clip = new THREE.AnimationClip('DropSequence', 10, [positionTrack]);

    return { group, animationClips: [clip] };
}
