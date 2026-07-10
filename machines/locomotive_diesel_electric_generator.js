import { steel, iron, copper, darkSteel } from '../utils/materials.js';

export function createDieselElectricGenerator(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Engine Block
    const engineGeo = new THREE.BoxGeometry(8, 4, 3);
    const engineBlock = new THREE.Mesh(engineGeo, iron);
    engineBlock.position.set(-2, 2, 0);
    engineBlock.name = 'engineBlock';
    group.add(engineBlock);

    // Generator Housing (Connected to Engine)
    const genGeo = new THREE.CylinderGeometry(1.5, 1.5, 4, 32);
    const generator = new THREE.Mesh(genGeo, darkSteel);
    generator.rotation.z = Math.PI / 2;
    generator.position.set(4, 2, 0);
    generator.name = 'generator';
    group.add(generator);
    
    // Internal Copper Coils representation
    const coilGeo = new THREE.CylinderGeometry(1.4, 1.4, 4.1, 32);
    const coil = new THREE.Mesh(coilGeo, copper);
    coil.rotation.z = Math.PI / 2;
    coil.position.set(4, 2, 0);
    group.add(coil);

    // Cooling Fan
    const fanGroup = new THREE.Group();
    fanGroup.name = 'fanGroup';
    fanGroup.position.set(-6.1, 2, 0);
    fanGroup.rotation.z = Math.PI / 2;
    
    const hubGeo = new THREE.CylinderGeometry(0.5, 0.5, 0.2, 16);
    const hub = new THREE.Mesh(hubGeo, steel);
    fanGroup.add(hub);

    for(let i=0; i<6; i++) {
        const bladeGeo = new THREE.BoxGeometry(2.5, 0.1, 0.5);
        bladeGeo.translate(1.25, 0, 0); // Translate so blade starts from hub
        const blade = new THREE.Mesh(bladeGeo, iron);
        blade.rotation.y = (Math.PI / 3) * i;
        blade.rotation.x = Math.PI / 6; // Slight pitch
        fanGroup.add(blade);
    }
    engineBlock.add(fanGroup); // Attach fan to engine block for shared vibration

    // Animations: Fan rotating, Engine Vibrating
    const times = [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0];
    const fanQuats = [];
    const enginePos = [];
    
    for(let i=0; i<=10; i++) {
        // High-speed Fan rotation
        const q = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), (i / 10) * Math.PI * 2);
        fanQuats.push(...q.toArray());

        // Engine vibration
        const vy = 2 + (Math.random() * 0.04 - 0.02);
        const vx = -2 + (Math.random() * 0.02 - 0.01);
        enginePos.push(vx, vy, 0);
    }

    const fanTrack = new THREE.QuaternionKeyframeTrack('fanGroup.quaternion', times, fanQuats);
    const engineTrack = new THREE.VectorKeyframeTrack('engineBlock.position', times, enginePos);
    
    const clip = new THREE.AnimationClip('Run', 1, [fanTrack, engineTrack]);
    animationClips.push(clip);

    return { group, animationClips };
}
