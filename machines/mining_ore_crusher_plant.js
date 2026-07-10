import * as materials from '../utils/materials.js';

export function createOreCrusherPlant(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    const matMetal = materials.metalMaterial || new THREE.MeshStandardMaterial({ color: 0x888888, roughness: 0.5, metalness: 0.7 });
    const matYellow = materials.yellowMaterial || new THREE.MeshStandardMaterial({ color: 0xffaa00, roughness: 0.5, metalness: 0.3 });
    const matDark = materials.darkMaterial || new THREE.MeshStandardMaterial({ color: 0x333333, roughness: 0.8, metalness: 0.5 });

    // Structure Base
    const baseGeo = new THREE.BoxGeometry(10, 1, 10);
    const base = new THREE.Mesh(baseGeo, matDark);
    group.add(base);

    // Support Pillars
    const pillarGeo = new THREE.CylinderGeometry(0.5, 0.5, 10);
    const pillarPositions = [
        [4, 5, 4], [-4, 5, 4], [4, 5, -4], [-4, 5, -4]
    ];
    pillarPositions.forEach(pos => {
        const p = new THREE.Mesh(pillarGeo, matMetal);
        p.position.set(...pos);
        group.add(p);
    });

    // Hopper (Inverted Cone/Pyramid)
    const hopperGeo = new THREE.ConeGeometry(5, 4, 4, 1, true);
    hopperGeo.rotateY(Math.PI / 4);
    hopperGeo.rotateX(Math.PI);
    const hopper = new THREE.Mesh(hopperGeo, matYellow);
    hopper.position.set(0, 12, 0);
    group.add(hopper);

    // Crusher Rollers
    const rollerGroup1 = new THREE.Group();
    rollerGroup1.name = "Roller1";
    rollerGroup1.position.set(-1.5, 8, 0);
    
    const rollerGroup2 = new THREE.Group();
    rollerGroup2.name = "Roller2";
    rollerGroup2.position.set(1.5, 8, 0);
    
    const rollerGeo = new THREE.CylinderGeometry(1.4, 1.4, 6, 16);
    rollerGeo.rotateX(Math.PI / 2);
    
    const roller1 = new THREE.Mesh(rollerGeo, matMetal);
    rollerGroup1.add(roller1);
    
    const roller2 = new THREE.Mesh(rollerGeo, matMetal);
    rollerGroup2.add(roller2);

    // Add teeth to rollers
    const toothGeo = new THREE.BoxGeometry(3, 0.2, 6);
    for(let i=0; i<8; i++){
        const tooth1 = new THREE.Mesh(toothGeo, matDark);
        tooth1.rotation.z = (i/8)*Math.PI*2;
        rollerGroup1.add(tooth1);
        
        const tooth2 = new THREE.Mesh(toothGeo, matDark);
        tooth2.rotation.z = (i/8)*Math.PI*2;
        rollerGroup2.add(tooth2);
    }
    
    group.add(rollerGroup1, rollerGroup2);

    // Conveyor Out
    const beltGroup = new THREE.Group();
    beltGroup.position.set(5, 3, 0);
    beltGroup.rotation.z = -Math.PI / 12;
    group.add(beltGroup);

    const conveyorBaseGeo = new THREE.BoxGeometry(15, 0.5, 4);
    const conveyorBase = new THREE.Mesh(conveyorBaseGeo, matYellow);
    beltGroup.add(conveyorBase);
    
    const cRollerGeo = new THREE.CylinderGeometry(0.3, 0.3, 4.2, 8);
    cRollerGeo.rotateX(Math.PI/2);
    const cRollers = [];
    for(let i=-6; i<=6; i+=2) {
        const cr = new THREE.Mesh(cRollerGeo, matDark);
        cr.position.set(i, 0.3, 0);
        cr.name = `CRoller_${i+6}`; // positive indices
        beltGroup.add(cr);
        cRollers.push(cr);
    }

    // Animation: Rollers spinning inward, Conveyor rolling
    const times = [0, 1, 2];
    const q1 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,0,1), 0);
    const q2 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,0,1), Math.PI);
    const q3 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,0,1), Math.PI * 2);
    const vals1 = [...q1.toArray(), ...q2.toArray(), ...q3.toArray()];
    
    const q1_inv = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,0,1), 0);
    const q2_inv = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,0,1), -Math.PI);
    const q3_inv = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,0,1), -Math.PI * 2);
    const vals2 = [...q1_inv.toArray(), ...q2_inv.toArray(), ...q3_inv.toArray()];

    const track1 = new THREE.QuaternionKeyframeTrack('Roller1.quaternion', times, vals1);
    const track2 = new THREE.QuaternionKeyframeTrack('Roller2.quaternion', times, vals2);
    
    const tracks = [track1, track2];
    cRollers.forEach(cr => {
        tracks.push(new THREE.QuaternionKeyframeTrack(`${cr.name}.quaternion`, times, vals2));
    });

    const clip = new THREE.AnimationClip('CrushAndConvey', 2, tracks);
    animationClips.push(clip);

    return { group, animationClips };
}
