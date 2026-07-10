import { materials } from '../utils/materials.js';

export function createBiosensorCircuit(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // PCB Base
    const boardGeo = new THREE.BoxGeometry( 8, 0.2, 6 );
    const boardMat = materials.circuitBoard || new THREE.MeshStandardMaterial({ color: 0x004400, roughness: 0.8 });
    const board = new THREE.Mesh( boardGeo, boardMat );
    group.add( board );

    // Biological reservoirs / Sensors
    const sensorGeo = new THREE.CylinderGeometry( 0.8, 0.8, 0.5, 32 );
    const sensorMat = materials.glass || new THREE.MeshPhysicalMaterial({ color: 0xffffff, transparent: true, opacity: 0.5 });
    
    const fluidGeo = new THREE.CylinderGeometry( 0.7, 0.7, 0.4, 32 );
    const fluidMat = materials.glowingGreen || new THREE.MeshStandardMaterial({ color: 0x00ff00, emissive: 0x005500 });
    
    const fluids = [];

    for (let i = -1; i <= 1; i += 2) {
        for (let j = -1; j <= 1; j += 2) {
            const sensor = new THREE.Mesh( sensorGeo, sensorMat );
            sensor.position.set( i * 2, 0.35, j * 1.5 );
            group.add( sensor );

            const fluid = new THREE.Mesh( fluidGeo, fluidMat );
            fluid.position.copy(sensor.position);
            group.add( fluid );
            fluids.push(fluid);
        }
    }

    // Microchip processor
    const chipGeo = new THREE.BoxGeometry( 1.5, 0.3, 1.5 );
    const chipMat = materials.darkMetal || new THREE.MeshStandardMaterial({ color: 0x111111, metalness: 0.8 });
    const chip = new THREE.Mesh( chipGeo, chipMat );
    chip.position.set( 0, 0.25, 0 );
    group.add( chip );

    // Animation: Fluid glowing / pulsating
    const times = [0, 1, 2];
    const scales = [1, 1.1, 1,  1, 1.1, 1,  1, 1.1, 1];
    
    const tracks = fluids.map(f => new THREE.VectorKeyframeTrack(`${f.uuid}.scale`, times, scales));
    
    const clip = new THREE.AnimationClip('Biosensing', 2, tracks);
    animationClips.push(clip);

    return { group, animationClips };
}
