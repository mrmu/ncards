const CARD_TYPES = {
	'DAMAGE' : {
		'slug' : 'DamageCard',
		'title' : '攻擊10',
		'value' : 10,
		'icon' : 'sword-wound.svg'
	},
	'DAMAGE_STRONG' : {
		'slug' : 'DamageStrongCard',
		'title' : '強攻30',
		'value' : 30,
		'icon' : 'blade-drag.svg'
	},
	'HEALTH' : {
		'slug' : 'HealthCard',
		'title' : '治療15',
		'value' : 15,
		'icon' : 'remedy.svg'
	},
	'SHIELD' : {
		'slug' : 'ShieldCard',
		'title' : '防禦25',
		'value' : 25,
		'icon' : 'round-shield.svg'
	}
};

var shuffle = function(arra1){
    let ctr = arra1.length, temp, index;

	// While there are elements in the array
    while (ctr > 0) {
	// Pick a random index
        index = Math.floor(Math.random() * ctr);
		// Decrease ctr by 1
        ctr--;
		// And swap the last element with it
        temp = arra1[ctr];
        arra1[ctr] = arra1[index];
        arra1[index] = temp;
    }
    return arra1;
};

var Card = function(value, type) {
	this.value = value;
	this.type = type;

	this.applyToSelf = function () {};
	this.applyToPlayer = function (player) {};

}

var HealthCard = function() {
	Card.call(this, CARD_TYPES.HEALTH.value, 'HEALTH');
	this.applyToSelf = function () {
		return true;
	}
	
	this.applyToPlayer = function (player) {
		player.heal(CARD_TYPES.HEALTH.value);
	}
}
var ShieldCard = function() {
	Card.call(this, CARD_TYPES.SHIELD.value, 'SHIELD');
	this.applyToSelf = function () {
		return true;
	}
	
	this.applyToPlayer = function (player) {
		player.shield(CARD_TYPES.SHIELD.value);
	}
}
var DamageCard = function() {
	Card.call(this, CARD_TYPES.DAMAGE.value, 'DAMAGE');
	this.applyToSelf = function () {
		return false;
	}
	
	this.applyToPlayer = function (player) {
		player.takeDamage(CARD_TYPES.DAMAGE.value);
	}
}
var DamageStrongCard = function() {
	Card.call(this, CARD_TYPES.DAMAGE_STRONG.value, 'DAMAGE');
	this.applyToSelf = function () {
		return false;
	}
	
	this.applyToPlayer = function (player) {
		player.takeDamage(CARD_TYPES.DAMAGE_STRONG.value);
	}
}

var Deck = function() {
	const NUMBER_OF_CARDS = 50;
	const entries = Object.entries(CARD_TYPES);
	this.deck = [];

	while (this.deck.length < NUMBER_OF_CARDS) {
		for (const [card, info] of entries) {
			if (this.deck.length >= NUMBER_OF_CARDS) {
				break;
			}
			let obj = {};
			obj[card] = info;
			this.deck.push(obj);
		}
	}
	// 洗牌
	shuffle(this.deck);

	this.draw = function () {
		// pop 一張卡並 return
		return this.deck.pop();
	}
	
	this.getNumberOfCards = function () {
		return this.deck.length;
	}
}

const MAX_CARDS = 6; // 使用者手上最多持有10張
var Player = function(name, sort) {
	const MAX_HEALTH = 100;
	const DEFAULT_SHIELD = 0;
	// let name, health, hand, shield;

	this.name = name;
	this.sort = sort;
	this.health_val = MAX_HEALTH;
	this.shield_val = DEFAULT_SHIELD;
	this.hand = [];

	this.getName = function() {
		return this.name;
	}
	this.getHealth = function() {
		return this.health_val;
	}
	this.setHealth = function(val) {
		this.health_val = val;
	}
	this.getShield = function() {
		return this.shield_val;
	}
	this.setShield = function(val) {
		this.shield_val = val;
	}

	this.takeDamage = function(d) {
		// 防值大於攻擊，就消耗防值
		if (this.shield_val > d) {
			this.shield_val -= d;
		}else{
			let value = d - this.shield_val;
			if (this.health_val >= value) {
				this.health_val -= value;
			} else {
				this.health_val = 0;
			}
			// 失去防禦效果
			this.removeStatus();
		}
	}
	this.heal = function(value) {
		if(this.health_val + value > MAX_HEALTH) {
			this.health_val = MAX_HEALTH;
		}else{
			this.health_val += value;
		}
	}
	this.shield = function(value) {
		if (this.shield_val <= 100) {
			this.shield_val += value; // 疊加
		}
	}

	this.draw = function(value) {
		// 手上的牌如果低於6張，就領
		if (this.hand.length < MAX_CARDS) {
			this.hand.push(value);
		}
	}
	
	this.getHand = function() {
		return this.hand;
	}
	
	this.getCard = function(i) {
		if (!this.hand[i]){
			return false;
		}
		return this.hand.splice(i, 1);
	}
	
	this.removeStatus = function() {
		this.shield_val = DEFAULT_SHIELD;
	}
}

var Game = function(p1_name, p2_name) {
	console.log('init game');
	$('.p1.name').val(p1_name);
	$('.p2.name').val(p2_name);

	this.onTurnOne = '';
	this.p1 = new Player(p1_name, '1');
	this.p2 = new Player(p2_name, '2');
	this.deck = new Deck();

	this.msg = function (msg) {
		$('.battle').html('<div class="alert alert-info" role="alert">'+msg+'</div>');
	}

	this.drawPhase = function (player){
		// 領一張牌 (this.deck.draw(): deck 是整付牌 pop 出一張)
 		player.draw(this.deck.draw());		
	}

	this.onTurn = function () {
		if (this.onTurnOne !== this.p1) {
			this.onTurnOne = this.p1;
			this.onTheOther = this.p2;
		} else {
			this.onTurnOne = this.p2;
			this.onTheOther = this.p1;
		}
	}

	this.renderCards = function(cards, container) {
		$(container).html('');
		for (let i = 0; i < cards.length; i++) {
			let title = Object.values(cards[i])[0].title;
			let slug = Object.values(cards[i])[0].slug;
			let icon = Object.values(cards[i])[0].icon;
			let key = Object.keys(cards[i])[0];
			const card_html = `
				<button class="btn btn-outline-dark ncard" data-id="${i}" data-slug="${slug}">
					<div class="icon"><img src="imgs/${icon}" alt="${key}"></div>
					<div class="title">${title}</div>
				</button>
			`;
			$(card_html).appendTo(container);
		}
	}

	this.mainPhase = function(player) {

		// let prompt = "輪到" + player.getName() + "了：" +  player.getHand() + "選擇一張卡牌：";

		let p1 = this.p1;
		let p2 = this.p2;

		this.renderPlayerStatus();

		let p1_hand = p1.getHand();
		this.renderCards(p1_hand, '.p1.ncards');

		let p2_hand = p2.getHand();
		this.renderCards(p2_hand, '.p2.ncards');

		$('.ncard').prop('disabled', true);
		$('.ncards.p'+player.sort+' button').prop('disabled', false);
	}

	this.renderNumberOfCards = function() {
		const total = this.deck.getNumberOfCards();
		let render_total = '';
		for (let i = 0; i < total; i++) {
			render_total += '●';
		}
		$('.NumberOfCards').html(render_total);
	}

	this.renderPlayerStatus = function() {
		// P1
		$('#p1_healthbar').css('width', this.p1.getHealth()+'%').html(this.p1.getHealth());
		if (this.p1.getHealth() < 50) {
			$('#p1_healthbar').removeClass('bg-success');
			$('#p1_healthbar').addClass('bg-danger');
		}else{
			$('#p1_healthbar').addClass('bg-success');
			$('#p1_healthbar').removeClass('bg-danger');			
		}
		$('#p1_shield').val(this.p1.getShield());

		// P2
		$('#p2_healthbar').css('width', this.p2.getHealth()+'%').html(this.p2.getHealth());
		if (this.p2.getHealth() < 50) {
			$('#p2_healthbar').removeClass('bg-success');
			$('#p2_healthbar').addClass('bg-danger');
		}else{
			$('#p2_healthbar').addClass('bg-success');
			$('#p2_healthbar').removeClass('bg-danger');
		}
		$('#p2_shield').val(this.p2.getShield());

		this.renderNumberOfCards();
	}
	// 卡牌發完
	this.outOfCards = function() {
		console.log('outOfCards');
		console.log(this.onTurnOne.getHealth());
		console.log(this.onTheOther.getHealth());
		let won, lost;
		if (this.onTurnOne.getHealth() > this.onTheOther.getHealth()){
			won = this.onTurnOne.getName();
			lost = this.onTheOther.getName();
		} else if (this.onTurnOne.getHealth() < this.onTheOther.getHealth()){
			won = this.onTheOther.getName();
			lost = this.onTurnOne.getName();
		} else {
			this.msg("你們雙方實力不相上下，這局平手。");
		}
		if (typeof won != 'undefined') {
			this.msg("卡牌已發完，" + won + " 擁有較多的生命值，所以他贏了。");
		}
	}
	this.victory = function() {
		let won = this.onTurnOne.getName();
		let lost = this.onTheOther.getName();
		this.msg(won + " 打敗了 " + lost + " 取得最後的勝利。");
	}

	this.endPhase = function() {
		this.renderPlayerStatus();

		
		// echo $this.player1.getName() . "的生命值: " . $this.player1.getHealth() . PHP_EOL;
		// echo $this.player2.getName() . "的生命值: " . $this.player2.getHealth() . PHP_EOL;
		// echo "整付牌還剩 " . ($this.deck.getNumberOfCards() - 1) . " 張。" . PHP_EOL;
		
		// 卡牌發完
		if (this.deck.getNumberOfCards() < 1) {
			this.outOfCards();
			return;
		}
		// 若對手生命沒了，就宣佈勝利
		if (this.onTheOther.getHealth() <= 0) {
			this.victory();
			return;
		}

		// 下一回合
		this.gameLoop();
	}

	this.gameLoop = function (){
		// console.log('game loop');
		this.onTurn(); // 看輪到哪個 player
		this.drawPhase(this.onTurnOne); // 發牌階段
		this.mainPhase(this.onTurnOne); // 對戰階段
		// this.endPhase(); 
	}

	// player 各領10張牌
	for (let i = 0; i < MAX_CARDS - 1; i++) {
		this.drawPhase(this.p1);
		this.drawPhase(this.p2);
	}
	this.gameLoop();

}

$(function(){
	let g = new Game('audi', 'brian');

	$(document).on('click', '.ncard', function(e){
		let card_class = $(this).data('slug');
		let card_id = $(this).data('id');
		let player = $(this).data('player');
		// 把出的牌 instancialize
		let play = new window[card_class]();
		g.onTurnOne.getCard(card_id);
		// 看是不是要用在自己身上的牌
		if (play.applyToSelf()) {
			play.applyToPlayer(g.onTurnOne);
		} else {
			play.applyToPlayer(g.onTheOther);
		}
		g.renderPlayerStatus();
		g.endPhase(); 
	})
})
