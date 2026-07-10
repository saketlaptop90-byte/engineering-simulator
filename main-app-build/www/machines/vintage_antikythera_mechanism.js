import { wood, brass, copper, darkSteel, glass } from '../utils/materials.js';

export function createAntikytheraMechanism(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Base wooden box (fragments)
    const boxGeom = new THREE.BoxGeometry(8, 10, 3);
    const box = new THREE.Mesh(boxGeom, wood);
    group.add(box);

    const gears = [];
    const gearData = [
        { radius: 2, z: 1.6, speed: 1, teeth: 32, x: 0, y: 0 },
        { radius: 1.5, z: 1.7, speed: -1.33, teeth: 24, x: 2, y: 2 },
        { radius: 1.0, z: 1.8, speed: 2, teeth: 16, x: -1, y: -2.5 },
        { radius: 2.5, z: -1.6, speed: -0.8, teeth: 40, x: 0.5, y: -1 },
        { radius: 1.2, z: -1.7, speed: 1.66, teeth: 20, x: -2, y: 1.5 }
    ];

    const tracks = [];

    gearData.forEach((data, index) => {
        const gearGroup = new THREE.Group();
        gearGroup.position.set(data.x, data.y, data.z);
        gearGroup.name = `antikythera_gear_${index}`;
        
        const cylGeom = new THREE.CylinderGeometry(data.radius, data.radius, 0.2, 32);
        const gearBody = new THREE.Mesh(cylGeom, brass);
        gearBody.rotation.x = Math.PI / 2;
        gearGroup.add(gearBody);

        for(let i = 0; i < data.teeth; i++) {
            const toothGeom = new THREE.BoxGeometry(0.2, 0.4, 0.2);
            const tooth = new THREE.Mesh(toothGeom, brass);
            tooth.position.set(Math.cos(i * Math.PI * 2 / data.teeth) * data.radius, Math.sin(i * Math.PI * 2 / data.teeth) * data.radius, 0);
            tooth.rotation.z = i * Math.PI * 2 / data.teeth;
            gearGroup.add(tooth);
        }

        // Add some inner spokes
        const spokeGeom = new THREE.BoxGeometry(data.radius * 2, 0.1, 0.25);
        const spoke1 = new THREE.Mesh(spokeGeom, brass);
        const spoke2 = new THREE.Mesh(spokeGeom, brass);
        spoke2.rotation.z = Math.PI / 2;
        gearGroup.add(spoke1);
        gearGroup.add(spoke2);

        group.add(gearGroup);

        const qStart = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), 0);
        const qMid = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), Math.PI * data.speed);
        const qEnd = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), Math.PI * 2 * data.speed);
        
        const track = new THREE.QuaternionKeyframeTrack(
            `${gearGroup.name}.quaternion`,
            [0, 1, 2],
            [...qStart.toArray(), ...qMid.toArray(), ...qEnd.toArray()]
        );
        tracks.push(track);
    });

    const clip = new THREE.AnimationClip('TurnGears', 2, tracks);
    animationClips.push(clip);

    return { group, animationClips };
}
