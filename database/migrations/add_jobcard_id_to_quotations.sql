ALTER TABLE quotations ADD COLUMN jobcard_id INT NULL;

ALTER TABLE quotations ADD CONSTRAINT fk_jobcard_id FOREIGN KEY (jobcard_id) REFERENCES jobcards(id) ON DELETE SET NULL;

CREATE INDEX idx_jobcard_id ON quotations(jobcard_id);
   