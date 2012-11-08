<?php

/**
 * test actions.
 *
 * @package    opTestApiPlugin
 * @subpackage action
 * @author     Kimura Youichi <kim.upsilon@bucyou.net>
 * @license    Apache License 2.0
 */
class testActions extends opJsonApiActions
{
  public function executeSetup(sfWebRequest $request)
  {
    if (!isset($request['force']) || '1' !== $request['force'])
    {
      return $this->forward400('

WARNING: This API overwrites existing database.
Do you really want to execute?
To execute this API, append `?force=1` to URL');
    }

    chdir(sfConfig::get('sf_root_dir'));
    $configuration = sfContext::getInstance()->getConfiguration();

    $task = new sfDoctrineDropDbTask($configuration->getEventDispatcher(), new sfFormatter());
    $task->setConfiguration($configuration);
    $task->run(array(), array('no-confirmation' => true));

    $task = new sfDoctrineBuildDbTask($configuration->getEventDispatcher(), new sfFormatter());
    $task->setConfiguration($configuration);
    $task->run();

    $task = new sfDoctrineBuildSqlTask($configuration->getEventDispatcher(), new sfFormatter());
    $task->setConfiguration($configuration);
    $task->run();

    $task = new sfDoctrineInsertSqlTask($configuration->getEventDispatcher(), new sfFormatter());
    $task->setConfiguration($configuration);
    $task->run();

    $task = new sfDoctrineDataLoadTask($configuration->getEventDispatcher(), new sfFormatter());
    $task->setConfiguration($configuration);
    $task->run(array('dir_or_file' => dirname(__FILE__).'/../../../../../test/fixtures/'));

    return $this->renderJSON(array('status' => 'success'));
  }
}
