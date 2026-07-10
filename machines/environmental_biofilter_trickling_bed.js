import * as mats from '../utils/materials.js';

export function createBiofilterTricklingBed(THREE) {
    const materials = mats.materials || mats;
    const group = new THREE.Group();
    const animationClips = [];

    const matConcrete = materials.concrete || new THREE.MeshStandardMaterial({ color: 0x999999 });
    const matMedia = materials.organic || new THREE.MeshStandardMaterial({ color: 0x4a3c2b, roughness: 0.9 });
    const matMetal = materials.metal || new THREE.MeshStandardMaterial({ color: 0xcccccc, metalness: 0.8 });
    const matWater = materials.water || new THREE.MeshBasicMaterial({ color: 0x0088ff, transparent: true, opacity: 0.6 });

    // Outer Tank
    const tankGeo = new THREE.CylinderGeometry(8, 8, 6, 32, 1, true);
    const tank = new THREE.Mesh(tankGeo, matConcrete);
    tank.material.side = THREE.DoubleSide;
    group.add(tank);

    // Media bed
    const mediaGeo = new THREE.CylinderGeometry(7.8, 7.8, 4, 32);
    const media = new THREE.Mesh(mediaGeo, matMedia);
    media.position.y = -1;
    group.add(media);

    // Rotary Distributor
    const distributorGroup = new THREE.Group();
    distributorGroup.name = "DistributorGroup";
    
    const centerPipeGeo = new THREE.CylinderGeometry(0.3, 0.3, 2, 16);
    const centerPipe = new THREE.Mesh(centerPipeGeo, matMetal);
    centerPipe.position.y = 1.5;
    distributorGroup.add(centerPipe);

    const armGeo = new THREE.CylinderGeometry(0.15, 0.15, 15, 16);
    const arm = new THREE.Mesh(armGeo, matMetal);
    arm.rotation.z = Math.PI / 2;
    arm.rotation.x = Math.PI / 2;
    arm.position.y = 2.4;
    distributorGroup.add(arm);

    // Water spray
    const sprayGeo = new THREE.BoxGeometry(15, 1.4, 0.1);
    const spray = new THREE.Mesh(sprayGeo, matWater);
    spray.position.y = 1.7;
    distributorGroup.add(spray);

    group.add(distributorGroup);

    // Animate rotation of distributor
    const q1 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), 0);
    const q2 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI);
    const q3 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI * 2);
    const track = new THREE.QuaternionKeyframeTrack(`DistributorGroup.quaternion`, [0, 2.5, 5], [
        q1.x, q1.y, q1.z, q1.w,
        q2.x, q2.y, q2.z, q2.w,
        q3.x, q3.y, q3.z, q3.w
    ]);
    const clip = new THREE.AnimationClip('SpinDistributor', 5, [track]);
    animationClips.push(clip);

    return { group, animationClips };
}
