<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<meta http-equiv="X-UA-Compatible" content="ie=edge">
	<title>nCard Game</title>
	<link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css" integrity="sha384-Vkoo8x4CGsO3+Hhxv8T/Q5PaXtkKtu6ug5TOeNV6gBiFeWPGFN9MuhOf23Q9Ifjh" crossorigin="anonymous">
	<style>
	.ncard{
		width: 50px;
		height: 100px;
	}
	.battle{
		width: 100%;
		height: 200px;
	}
	.upsidedown{
		transform: rotate(180deg);
	    text-align: right;
	}
	.upsidedown input{
		text-align: right;
	}
	</style>
	<script src="https://code.jquery.com/jquery-3.4.1.slim.min.js" integrity="sha384-J6qa4849blE2+poT4WnyKhv5vZF5SrPo0iEjwBvKU7imGFAV0wwj1yYfoRSJoZ+n" crossorigin="anonymous"></script>
	<script src="https://cdn.jsdelivr.net/npm/popper.js@1.16.0/dist/umd/popper.min.js" integrity="sha384-Q6E9RHvbIyZFJoft+2mJbHaEWldlvI9IOYy5n3zV9zzTtmI3UksdQRVvoxMfooAo" crossorigin="anonymous"></script>
	<script src="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/js/bootstrap.min.js" integrity="sha384-wfSDF2E50Y2D1uUdj0O3uMBJnjuUD4Ih7YwaYd1iqfktj0Uod8GCExl3Og8ifwB6" crossorigin="anonymous"></script>
	<script src='game.js?c'></script>
</head>
<body>
	<div class="container">
		<div class="row">
			<div class="col-12">
				<div>剩餘卡牌：<input type="text" class="NumberOfCards" value=""></div>
				<div class="upsidedown">
					<input type="text" name="p1" class="p1 name">
					鎧甲：<input type="text" name="p1_shield" id="p1_shield">
					<div class="progress">
						<div id="p1_healthbar" class="progress-bar progress-bar-striped progress-bar-animated bg-success" role="progressbar" style="width: 100%" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100"></div>
					</div>
					<input type="hidden" class="p1 health" readonly>
					<div class="p1 ncards"></div>
				</div>
				<div class="battle">

				</div>
				<div>
					<input type="text" name="p2" class="p2 name" value="">
					鎧甲：<input type="text" name="p2_shield" id="p2_shield">
					<div class="progress">
						<div id="p2_healthbar" class="progress-bar progress-bar-striped progress-bar-animated bg-success" role="progressbar" style="width: 100%" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100"></div>
					</div>
					<input type="hidden" class="p2 health" readonly>
					<div class="p2 ncards"></div>
				</div>
			</div>
		</div>
	</div>

</body>
</html>
