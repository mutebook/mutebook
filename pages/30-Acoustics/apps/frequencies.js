// frequencies - buttons on a spiral

function frequencies (divId) {
  book.loadAudio();

  const qm = QuintMachine(divId, 1), [fg, bg, over] = qm.fbo();
  // size without margins
  const [sx, sy, cx, cy] = qm.sz();

  // spiral
  let minPch = qm.toPch(50), ctrPch = qm.toPch(1000), maxPch = qm.toPch(20000);
  let sp = bg.pitchSpiral([cx, cy], sy/12, sy/2, minPch, ctrPch, maxPch);
  sp.markPitch(ctrPch, 'red');

  // sine tones - buttons
  function sine(freq, label) {
    if (!label)
      label = freq.toString();
    let btn = over.addButton(label, true, function () {
      MC.Klang.tone(btn, freq, 'sine');
      btn.toggle();
    });

    const [x, y] = sp.toXY(qm.toPch(freq));
    btn.centerAt([x + cx, y + cy]);
  }

  for (fl of [[50], [100], [150], [200], [250], [300], [350], [400], [450], [500], [550], [600], [650], [700], [750], [800], [850], [900], [950], [1000], [1100], [1200], [1300], [1400], [1500], [1600], [1700], [1800], [1900], [2000], [2100], [2200], [2300], [2400], [2500], [2600], [2700], [2800], [2900], [3000], [3200], [3400], [3600], [3800], [4000], [4200], [4400], [4600], [4800], [5000], [5500], [6000], [6500], [7000], [7500], [8000], [8500], [9000, '9k'], [10000, '10k'], [11000, '11k'], [12000, '12k'], [13000, '13k'], [14000, '14k'], [15000, '15k'], [16000, '16k'], [17000, '17k'], [18000, '18k'], [19000, '19k'], [20000, '20k']]) {
    let [freq, label] = fl;
    sine(freq, label);
  }
}

// eof