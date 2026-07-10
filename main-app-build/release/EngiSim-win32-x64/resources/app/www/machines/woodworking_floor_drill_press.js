import { steel, iron, wood, redAccent, blackPlastic } from '../utils/materials.js';

export function createFloorDrillPress(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Base
    const base = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.2, 2), iron);
    base.position.set(0, 0.1, 0);
    group.add(base);

    // Column
    const column = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 4, 16), steel);
    column.position.set(0, 2.1, -0.5);
    group.add(column);

    // Table
    const tableGroup = new THREE.Group();
    tableGroup.position.set(0, 2.0, 0);
    
    const tableBracket = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.4, 1), iron);
    tableBracket.position.set(0, 0, -0.2);
    tableGroup.add(tableBracket);

    const table = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 0.8, 0.1, 32), iron);
    table.position.set(0, 0.25, 0.3);
    tableGroup.add(table);
    group.add(tableGroup);

    // Head / Motor Housing
    const headGroup = new THREE.Group();
    headGroup.position.set(0, 3.8, 0);

    const motorHousing = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.8, 2.2), redAccent);
    motorHousing.position.set(0, 0, -0.2);
    headGroup.add(motorHousing);

    // Handles
    const handleHub = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.2), blackPlastic);
    handleHub.rotation.z = Math.PI / 2;
    handleHub.position.set(0.7, -0.2, 0.2);
    headGroup.add(handleHub);
    
    group.add(headGroup);

    // Spindle Assembly (Animates up/down and rotates)
    const spindleGroup = new THREE.Group();
    spindleGroup.name = "drillSpindleGroup";
    spindleGroup.position.set(0, 3.4, 0.5); // Placed above table
    
    const chuck = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.15, 0.4, 16), steel);

    const bit = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.8, 16), steel);
    bit.position.set(0, -0.6, 0);

    const drillRotGroup = new THREE.Group();
    drillRotGroup.name = "drillRotGroup";
    drillRotGroup.add(chuck);
    drillRotGroup.add(bit);
    
    spindleGroup.add(drillRotGroup);
    group.add(spindleGroup);

    // Animation: Drill moving down and spinning
    // Spindle translation
    const posTrack = new THREE.VectorKeyframeTrack(
        `${spindleGroup.name}.position`,
        [0, 1, 2],
        [
            0, 3.4, 0.5,
            0, 2.8, 0.5,
            0, 3.4, 0.5
        ]
    );

    const spinTimes = [];
    const spinValues = [];
    let angle = 0;
    for(let i=0; i<=20; i++) {
        spinTimes.push(i * 0.1);
        const q = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), angle);
        spinValues.push(q.x, q.y, q.z, q.w);
        angle += Math.PI; 
    }
    const fullRotTrack = new THREE.QuaternionKeyframeTrack(
        `${drillRotGroup.name}.quaternion`,
        spinTimes,
        spinValues
    );

    const clip = new THREE.AnimationClip('DrillPressAction', 2, [posTrack, fullRotTrack]);
    animationClips.push(clip);

    return { group, animationClips };
}
