import { darkSteel, aluminum, brass } from '../utils/materials.js';

export function createRootsBlower(THREE) {
    const group = new THREE.Group();
    
    const createLobe = () => {
        const lGroup = new THREE.Group();
        const c1 = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 1.2, 4, 32), aluminum);
        c1.position.set(0, 1.2, 0);
        const c2 = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 1.2, 4, 32), aluminum);
        c2.position.set(0, -1.2, 0);
        const box = new THREE.Mesh(new THREE.BoxGeometry(2.4, 2.4, 4), aluminum);
        
        // Add some brass accents to the lobes
        const accentGeom = new THREE.CylinderGeometry(1.25, 1.25, 0.2, 32);
        const a1 = new THREE.Mesh(accentGeom, brass);
        a1.position.set(0, 1.2, 2.01);
        const a2 = new THREE.Mesh(accentGeom, brass);
        a2.position.set(0, -1.2, 2.01);
        
        lGroup.add(c1, c2, box, a1, a2);
        lGroup.rotation.x = Math.PI / 2; // Orient along Z
        return lGroup;
    }
    
    const lobe1 = createLobe();
    lobe1.name = "Lobe1";
    lobe1.position.set(-1.8, 0, 0);
    group.add(lobe1);
    
    const lobe2 = createLobe();
    lobe2.name = "Lobe2";
    lobe2.position.set(1.8, 0, 0);
    // Initial 90-degree offset for the second lobe
    lobe2.rotation.z = Math.PI / 2; 
    group.add(lobe2);

    const makeQArray = (axis, startAngle, mult) => {
        const arr = [];
        for(let i=0; i<=4; i++){
            const angle = startAngle + mult * (i/4)*Math.PI*2;
            const q = new THREE.Quaternion().setFromAxisAngle(axis, angle);
            arr.push(q.x, q.y, q.z, q.w);
        }
        return arr;
    };
    
    const times = [0, 0.5, 1.0, 1.5, 2.0];
    
    const track1 = new THREE.QuaternionKeyframeTrack('Lobe1.quaternion', times, makeQArray(new THREE.Vector3(0,0,1), 0, 1));
    const track2 = new THREE.QuaternionKeyframeTrack('Lobe2.quaternion', times, makeQArray(new THREE.Vector3(0,0,1), Math.PI/2, -1));

    const clip = new THREE.AnimationClip('RootsOperation', 2, [track1, track2]);

    return { group, animationClips: [clip] };
}
