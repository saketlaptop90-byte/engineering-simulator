export function createMeiosisCrossingOver(THREE) {
  const group = new THREE.Group();

  // 1. Homologous Chromosomes (One from mom, one from dad)
  const chromoGroup = new THREE.Group();
  group.add(chromoGroup);

  const matMom = new THREE.MeshStandardMaterial({ color: 0xff44aa }); // Pink
  const matDad = new THREE.MeshStandardMaterial({ color: 0x44aaff }); // Blue

  // A chromosome is made of two sister chromatids joined at the centromere
  const createChromatid = (mat, offset) => {
    const cGroup = new THREE.Group();
    // Top arm (short p arm)
    const top = new THREE.Mesh(new THREE.CapsuleGeometry(0.3, 1), mat);
    top.position.y = 0.8;
    // Bottom arm (long q arm)
    const bot = new THREE.Mesh(new THREE.CapsuleGeometry(0.3, 2), mat);
    bot.position.y = -1.3;
    cGroup.add(top, bot);
    cGroup.position.x = offset;
    return { group: cGroup, top: top, bot: bot, mat: mat };
  };

  // Mom's Chromosome
  const momC1 = createChromatid(matMom, -0.4);
  const momC2 = createChromatid(matMom, 0.4);
  const momChromo = new THREE.Group();
  momChromo.add(momC1.group, momC2.group);
  momChromo.position.x = -2;

  // Dad's Chromosome
  const dadC1 = createChromatid(matDad, -0.4);
  const dadC2 = createChromatid(matDad, 0.4);
  const dadChromo = new THREE.Group();
  dadChromo.add(dadC1.group, dadC2.group);
  dadChromo.position.x = 2;

  chromoGroup.add(momChromo, dadChromo);

  momChromo.userData = { id: 'homologous_pair', name: 'Homologous Chromosomes', description: 'A pair of chromosomes carrying the same genes. One inherited from the mother, one from the father.' };

  // 2. Centromeres
  const centroMat = new THREE.MeshStandardMaterial({ color: 0xffff00 });
  const centroM = new THREE.Mesh(new THREE.SphereGeometry(0.4), centroMat);
  momChromo.add(centroM);
  const centroD = new THREE.Mesh(new THREE.SphereGeometry(0.4), centroMat);
  dadChromo.add(centroD);

  let phase = 0; // 0: approaching, 1: synapsis (pairing), 2: crossing over, 3: separating
  let timer = 0;

  group.userData.animate = function(delta) {
    timer += delta;

    if (phase === 0) {
      // Approach (Prophase I)
      momChromo.position.lerp(new THREE.Vector3(-0.6, 0, 0), 0.05);
      dadChromo.position.lerp(new THREE.Vector3(0.6, 0, 0), 0.05);
      
      if (timer > 2) {
        phase = 1;
        timer = 0;
      }
    } else if (phase === 1) {
      // Synapsis (Forming a Tetrad)
      // The inner chromatids (momC2 and dadC1) touch and bend
      momC2.bot.rotation.z = -0.3;
      momC2.bot.position.x = 0.3;
      
      dadC1.bot.rotation.z = 0.3;
      dadC1.bot.position.x = -0.3;

      if (timer > 2) {
        phase = 2;
        timer = 0;
      }
    } else if (phase === 2) {
      // Crossing Over (Swapping DNA chunks)
      // We physically swap the colors of the bottom half of the inner chromatids
      
      // We'll fake it by splitting the bottom capsule into two pieces visually
      if (timer < 0.1 && momC2.bot.geometry.type === 'CapsuleGeometry') {
        // Replace with two stacked capsules
        const replaceArm = (chromatid, oldMat, newMat) => {
          chromatid.group.remove(chromatid.bot);
          
          const topHalf = new THREE.Mesh(new THREE.CapsuleGeometry(0.3, 0.7), oldMat);
          topHalf.position.y = -0.65;
          const botHalf = new THREE.Mesh(new THREE.CapsuleGeometry(0.3, 0.7), newMat);
          botHalf.position.y = -1.95;
          
          chromatid.group.add(topHalf, botHalf);
          chromatid.botHalf = botHalf; // reference to animate it
        };
        
        replaceArm(momC2, matMom, matDad);
        replaceArm(dadC1, matDad, matMom);
        
        // Reapply the bend
        momC2.group.children[1].rotation.z = -0.3;
        momC2.group.children[1].position.x = 0.3;
        momC2.group.children[2].rotation.z = -0.3;
        momC2.group.children[2].position.x = 0.6; // swapped piece further out

        dadC1.group.children[1].rotation.z = 0.3;
        dadC1.group.children[1].position.x = -0.3;
        dadC1.group.children[2].rotation.z = 0.3;
        dadC1.group.children[2].position.x = -0.6;
      }

      if (timer > 2) {
        phase = 3;
        timer = 0;
      }
    } else if (phase === 3) {
      // Separating (Anaphase I)
      momChromo.position.x -= 0.02;
      dadChromo.position.x += 0.02;

      // Straighten out
      momC2.group.children[1].rotation.z = 0;
      momC2.group.children[1].position.x = 0;
      momC2.group.children[2].rotation.z = 0;
      momC2.group.children[2].position.x = 0;

      dadC1.group.children[1].rotation.z = 0;
      dadC1.group.children[1].position.x = 0;
      dadC1.group.children[2].rotation.z = 0;
      dadC1.group.children[2].position.x = 0;

      if (timer > 3) {
        // Reset simulation (hard reload to original geometry)
        phase = 0;
        timer = 0;
        
        momChromo.position.x = -2;
        dadChromo.position.x = 2;
        
        // Reset momC2
        while(momC2.group.children.length > 1) momC2.group.remove(momC2.group.children[1]);
        momC2.bot = new THREE.Mesh(new THREE.CapsuleGeometry(0.3, 2), matMom);
        momC2.bot.position.y = -1.3;
        momC2.group.add(momC2.bot);

        // Reset dadC1
        while(dadC1.group.children.length > 1) dadC1.group.remove(dadC1.group.children[1]);
        dadC1.bot = new THREE.Mesh(new THREE.CapsuleGeometry(0.3, 2), matDad);
        dadC1.bot.position.y = -1.3;
        dadC1.group.add(dadC1.bot);
      }
    }

    // Gentle floating
    chromoGroup.position.y = Math.sin(Date.now()*0.002)*0.2;
  };

  group.userData.quiz = [
    { question: "What is the purpose of Crossing Over during Meiosis?", options: ["To repair damaged DNA", "To increase genetic diversity by mixing the mother's and father's genes before passing them to the child", "To make the chromosomes smaller"], answer: 1 },
    { question: "When does Crossing Over occur?", options: ["During Mitosis", "Prophase I of Meiosis", "Anaphase II of Meiosis"], answer: 1 }
  ];

  return group;
}
