drop table clues_flat;

with class_cats as (
	select classifications.clue_id, categories.id as cat_id, categories.category
	from classifications, categories
	where classifications.category_id = categories.id
),

docs_clues_cats as (
	select clues.game, clues.value, clues.round,
		documents.clue, documents.answer,
		class_cats.category, class_cats.cat_id
	from clues, documents, class_cats
	where clues.id = documents.id and
		class_cats.clue_id = clues.id
),

clues_flat as (
	select docs_clues_cats.*, airdates.airdate,s
		substring(md5('saltysalt' || docs_clues_cats.clue) from 1 for 8) as hashid
	from docs_clues_cats, airdates
	where airdates.game = docs_clues_cats.game
	order by cat_id, value
)

select * into clues_flat from clues_flat;



