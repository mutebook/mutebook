//toc mb_contact; hr; Contact

function isBot() {
  $whois = @$_POST['whois'];
  if (empty($whois)) return true; // not set - first call
  $isBot = 'Loompa' != $whois;
  if ($isBot) sleep(13);
  return $isBot;
}

function sendMail($to, $subj, $body) {
  $body .= "\n(from IP: ${_SERVER['REMOTE_ADDR']})\n";
  return @mail($to, $subj, $body, 'From: jan@mutebook.me');
}

$name  = @$_POST['name'];
$email = @$_POST['email'];
$text  = @$_POST['text'];

$success = false; $heads = 'Send a message to the authors:';
if (isBot() || (empty($name) && empty($email) && empty($text))) {
  $success = true; // quiet fail
} else
if (empty($email) || empty($text)) {
  $heads = 'Please fill in all required fields:';
} else
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
  $heads = 'Please correct the e-mail address.';
} else {
  $subj = 'Message to authors posted at mutebook.me';
  $body = "name: [$name]\nemail: [$email]\n-----\n$text\n-----\n";
  if (!sendMail('authors@mutebook.me', $subj, $body))
     $heads = 'The post office is closed. Try again later.';
  else {
    $success = true;
    $heads = 'Your message has been sent. Thank you!';
    $name = $email = $text = '';
  }
}

?>
<h1>Contact</h1>
<hr/>
<form action="<?=$_SERVER['REQUEST_URI']?>" method="post">
  <table>
    <thead>
    <tr><td></td><td><?=$heads?></td></tr>
    </thead>
    <tbody>
    <tr>
      <td class="label">your name:</td>
      <td><input type="text" size="64" name="name" value="<?=@$name?>"/></td>
    </tr><tr>
      <td class="label required">your e-mail address:</td>
      <td><input type="text" name="email" value="<?=@$email?>"/></td>
    </tr><tr>
      <td class="label required" >text:</td>
      <td><textarea rows="8" name="text"><?=@$text?></textarea></td>
    </tr>
    </tbody>
    <thead>
    <tr>
      <td class="legend"></td>
      <td><input id="Oompa" type="hidden" name="whois" value="Oompa"/><input type="submit" name="submit" value="Send!"/></td>
    </tr>
    </thead>
  </table>
</form>
<hr/>

<script>document.getElementById('Oompa').value='Loompa';</script>
