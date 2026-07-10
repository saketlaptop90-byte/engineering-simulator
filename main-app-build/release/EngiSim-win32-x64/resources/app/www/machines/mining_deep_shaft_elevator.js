import * as materials from '../utils/materials.js';

export function createDeepShaftElevator(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    const matMetal = materials.metalMaterial || new THREE.MeshStandardMaterial({ color: 0x999999, roughness: 0.3, metalness: 0.8 });
    const matYellow = materials.yellowMaterial || new THREE.MeshStandardMaterial({ color: 0xffbb00, roughness: 0.5, metalness: 0.2 });
    const matDark = materials.darkMaterial || new THREE.MeshStandardMaterial({ color: 0x222222, roughness: 0.7, metalness: 0.6 });

    // Headframe (surface structure)
    const frameGeo = new THREE.CylinderGeometry(0.3, 0.3, 30);
    const framePos = [
        [4, 15, 4], [-4, 15, 4], [4, 15, -4], [-4, 15, -4],
        [6, 15, 6], [-6, 15, 6] // angle supports
    ];
    framePos.forEach((pos, i) => {
        const f = new THREE.Mesh(frameGeo, matMetal);
        f.position.set(...pos);
        if (i >= 4) {
            f.rotation.z = i === 4 ? -Math.PI/8 : Math.PI/8;
            f.position.y = 14;
        }
        group.add(f);
    });

    // Top Platform & Hoist Wheels (Sheaves)
    const platformGeo = new THREE.BoxGeometry(10, 1, 10);
    const platform = new THREE.Mesh(platformGeo, matDark);
    platform.position.set(0, 30, 0);
    group.add(platform);

    const wheelGeo = new THREE.CylinderGeometry(3, 3, 0.5, 32);
    wheelGeo.rotateX(Math.PI/2);
    
    const wheel1 = new THREE.Mesh(wheelGeo, matYellow);
    wheel1.name = "HoistWheel1";
    wheel1.position.set(-2, 33, 0);
    
    const wheel2 = new THREE.Mesh(wheelGeo, matYellow);
    wheel2.name = "HoistWheel2";
    wheel2.position.set(2, 33, 0);
    
    group.add(wheel1, wheel2);

    // Elevator Cage
    const cageGroup = new THREE.Group();
    cageGroup.name = "ElevatorCage";
    cageGroup.position.set(0, 0, 0);
    group.add(cageGroup);

    const cageBaseGeo = new THREE.BoxGeometry(6, 0.5, 6);
    const cageBase = new THREE.Mesh(cageBaseGeo, matYellow);
    cageGroup.add(cageBase);

    const cageRoof = new THREE.Mesh(cageBaseGeo, matYellow);
    cageRoof.position.set(0, 8, 0);
    cageGroup.add(cageRoof);

    const barGeo = new THREE.CylinderGeometry(0.1, 0.1, 8);
    for(let x=-2.8; x<=2.8; x+=1.4){
        for(let z=-2.8; z<=2.8; z+=1.4){
            if(Math.abs(x) === 2.8 || Math.abs(z) === 2.8) {
                const bar = new THREE.Mesh(barGeo, matMetal);
                bar.position.set(x, 4, z);
                cageGroup.add(bar);
            }
        }
    }

    // Cables
    const cableGeo = new THREE.CylinderGeometry(0.1, 0.1, 1);
    cableGeo.translate(0, -0.5, 0); // scale from top

    const cable1 = new THREE.Mesh(cableGeo, matDark);
    cable1.name = "Cable1";
    cable1.position.set(-2, 33, 0);
    
    const cable2 = new THREE.Mesh(cableGeo, matDark);
    cable2.name = "Cable2";
    cable2.position.set(2, 33, 0);
    
    group.add(cable1, cable2);

    // Animation: Cage goes down and up
    const times = [0, 4, 5, 9, 10];
    const yVals = [20, -50, -50, 20, 20];
    
    const cageTrack = new THREE.VectorKeyframeTrack('ElevatorCage.position', times, 
        yVals.flatMap(y => [0, y, 0])
    );

    // Cable scaling
    // base length at y=20 is 33-28=5. At y=-50, it is 33-(-42)=75.
    const sVals = yVals.map(y => 33 - (y + 8)); // y+8 is cage roof
    const cable1Track = new THREE.VectorKeyframeTrack('Cable1.scale', times,
        sVals.flatMap(s => [1, s, 1]) 
    );
    const cable2Track = new THREE.VectorKeyframeTrack('Cable2.scale', times,
        sVals.flatMap(s => [1, s, 1])
    );

    // Wheel spinning
    // distance = delta Y. angle = distance / radius (3).
    const rotations = yVals.map(y => (20 - y) / 3);
    const qTracks = [];
    ['HoistWheel1', 'HoistWheel2'].forEach(wName => {
        const qVals = rotations.map(r => {
            const q = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,0,1), r);
            return [...q.toArray()];
        }).flat();
        qTracks.push(new THREE.QuaternionKeyframeTrack(`${wName}.quaternion`, times, qVals));
    });

    const clip = new THREE.AnimationClip('ShaftOperation', 10, [cageTrack, cable1Track, cable2Track, ...qTracks]);
    animationClips.push(clip);

    return { group, animationClips };
}
